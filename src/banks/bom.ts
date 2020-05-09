import { By, WebElement, WebDriver, until } from 'selenium-webdriver';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount, ColumnIndexes } from '../types';
import { createDriver, screenshotToDisk, textContains } from '../selenium';
import * as moment from 'moment';
import logger from '../logger';

const LOGIN_PAGE_URL = 'https://ibanking.bankofmelbourne.com.au/ibank/loginPage.action';
const BOM_DATE_FORMAT = 'DD/MM/YYYY';

export interface BomCredentials {
  accessNumber: string;
  securityNumber: string;
  password: string;
}

export const bomCredentialsReader = (key: string): BomCredentials => {
  const [accessNumber, securityNumber, password] = decrypt(key).split('|');
  return {
    accessNumber,
    securityNumber,
    password,
  };
};

export const parseAmount = (debit: string, credit: string): number => {
  let isDebit = debit.length > 0;
  let amountInText = isDebit ? debit : credit;
  const amount = parseFloat(amountInText.replace('$', '').replace(',', ''));

  if (Number.isNaN(amount)) {
    return null;
  }

  return isDebit ? -amount : amount;
};

export const parseDate = (text: string): moment.Moment => {
  return moment(text, BOM_DATE_FORMAT);
};

const parseAmountFromColumns = async (debitColumn: WebElement, creditColumn: WebElement): Promise<number> => {
  const debitText = await debitColumn.getText();
  const creditText = await creditColumn.getText();
  return parseAmount(debitText, creditText);
};

const getColumnIndexesFromHeadingRow = async (row: WebElement): Promise<ColumnIndexes> => {
  const columns = await row.findElements(By.css('th'));
  let dateIndex: number = null;
  let descriptionIndex: number = null;
  let debitIndex: number = null;
  let creditIndex: number = null;

  for (let i = 0; i < columns.length; i++) {
    const text = await columns[i].getText();
    dateIndex = textContains(text, 'date') ? i : dateIndex;
    descriptionIndex = textContains(text, 'description') ? i : descriptionIndex;
    debitIndex = textContains(text, 'debit') ? i : debitIndex;
    creditIndex = textContains(text, 'credit') ? i : creditIndex;
  }

  if (dateIndex === null || descriptionIndex === null || debitIndex === null || creditIndex === null) {
    return null;
  }

  return {
    dateIndex,
    descriptionIndex,
    debitIndex,
    creditIndex,
  };
};

const getTransactions = async (
  driver: WebDriver,
  headingSelector: string,
  rowSelector: string,
): Promise<BankTransaction[]> => {
  const headingRows = await driver.findElements(By.css(headingSelector));
  if (headingRows.length === 0) {
    logger.warn(`bom: Heading rows cannot be found for selector ${headingSelector}`);
    return [];
  }

  const indexes = await getColumnIndexesFromHeadingRow(headingRows[0]);
  if (indexes === null) {
    logger.info(`bom: Unable to get the column indexes for selector ${rowSelector}`);
    return [];
  }

  const { dateIndex, debitIndex, creditIndex, descriptionIndex } = indexes;
  const rows = await driver.findElements(By.css(rowSelector));

  if (!rows || rows.length === 0) {
    return [];
  }

  const firstItemText = await rows[0].getText();
  if (firstItemText.trim().toLowerCase().indexOf('no transactions found') > -1) {
    logger.info(`bom: No transactions found`);
    return [];
  }

  const txns = await Promise.all(
    rows.map(async (r: WebElement) => {
      const columns = await r.findElements(By.css('td'));
      const dateText = await columns[dateIndex].getText();
      const parsedDate = parseDate(dateText);
      const descriptionText = await columns[descriptionIndex].getText();

      if (!dateText || !descriptionText || !parsedDate.isValid()) {
        return null;
      }

      return {
        date: parsedDate.format(),
        amount: await parseAmountFromColumns(columns[debitIndex], columns[creditIndex]),
        description: descriptionText,
      };
    }),
  );

  return txns.filter(Boolean).filter((t) => t.amount && t.description && t.date);
};

export const bomAccountReader = (driver: WebDriver, account: BankAccount): BankAccountReader => {
  return {
    getBankTransactions: async (): Promise<BankTransaction[]> => {
      const historyTableTransactions = await getTransactions(
        driver,
        '#txnHistoryTable thead tr',
        '#txnHistoryTable tbody tr',
      );

      const pendingTableTransactions = await getTransactions(
        driver,
        '.transaction-pending table thead tr',
        '.transaction-pending table tbody tr',
      );

      return [...historyTableTransactions, ...pendingTableTransactions];
    },
  };
};

export const bomCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { accessNumber, securityNumber, password }: BomCredentials = bomCredentialsReader(credentials);
  const driver = await createDriver();

  return {
    login: async (): Promise<void> => {
      await driver.get(LOGIN_PAGE_URL);
      await driver.findElement(By.id('access-number')).sendKeys(accessNumber);
      await driver.findElement(By.id('securityNumber')).sendKeys(securityNumber);
      await driver.findElement(By.id('internet-password')).sendKeys(password);
      await driver.findElement(By.id('logonButton')).click();
    },
    getAccountReader: async (account: BankAccount): Promise<BankAccountReader> => {
      const viewAccountElement = await driver.wait(until.elementLocated(By.css('a[href="viewAccountPortfolio.html')));
      await viewAccountElement.click();

      const accountNameLink = await driver.wait(
        until.elementLocated(By.css(`[data-acctalias="${account.accountName}"] > h2 > a`)),
      );
      await accountNameLink.click();

      return bomAccountReader(driver, account);
    },
    quit: async () => {
      await driver.quit();
    },
    screenshot: async () => {
      await screenshotToDisk(`bom-${Date.now()}`, driver);
    },
  };
};
