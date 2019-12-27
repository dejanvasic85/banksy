import { By, WebElement, WebDriver } from 'selenium-webdriver';
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

const getHistoryTableTransactions = async (driver: WebDriver): Promise<BankTransaction[]> => {
  const headingRows = await driver.findElements(By.css('#txnHistoryTable thead tr'));
  if (headingRows.length === 0) {
    logger.info('Heading rows cannot be found');
    return [];
  }

  const indexes = await getColumnIndexesFromHeadingRow(headingRows[0]);
  if (!indexes) {
    logger.info('Heading indexes cannot be parsed', { indexes });
    return [];
  }

  const rows = await driver.findElements(By.css('#txnHistoryTable tbody tr'));

  return Promise.all(
    rows
      .map(async (r: WebElement) => {
        const columns = await r.findElements(By.css('td'));
        // if (columns.length < indexes.dateIndex) {
        //   return null;
        // }

        // const dateText = parseDate(await columns[indexes.dateIndex].getText()).format();

        return {
          date: parseDate(await columns[indexes.dateIndex].getText()).format(),
          amount: await parseAmountFromColumns(columns[indexes.debitIndex], columns[indexes.creditIndex]),
          description: await columns[indexes.descriptionIndex].getText(),
        };
      })
      .filter(Boolean),
  );
};

const getPendingTransactionRows = async (driver: WebDriver): Promise<WebElement[]> => {
  return await driver.findElements(By.css(`.transaction-pending > table > tbody > tr`));
};

// const getPendingTransactionRows = async (driver: WebDriver): Promise<BankTransaction[]> => {
//   const rows = await driver.findElements(By.css(`.transaction-pending > table > tbody > tr`));

//   return Promise.all(
//     rows
//       .map(async (r: WebElement) => {
//         const columns = await r.findElements(By.css('td'));
//         if (columns.length < 5) {
//           return null;
//         }

//         return {
//           date: parseDate(await columns[0].getText()).format(),
//           amount: await parseAmountFromColumns(columns[3], columns[4]),
//           description: await columns[2].getText(),
//         };
//       })
//       .filter(Boolean),
//   );
// };

export const bomAccountReader = (driver: WebDriver, account: BankAccount): BankAccountReader => {
  return {
    getBankTransactions: async (): Promise<BankTransaction[]> => {
      return await getHistoryTableTransactions(driver);
    },

    // @ts-ignore
    getBankTransactionsOld: async (): Promise<BankTransaction[]> => {
      const txns = [];
      // const rows = account.pendingTransactionsOnly
      //   ? await getPendingTransactionRows(driver)
      //   : await getTransactionRows(driver);

      const rows = await getPendingTransactionRows(driver);

      logger.info(`Found [${rows.length}] rows for account [${account.accountName}] `);

      for (const row of rows) {
        const columns = await row.findElements(By.css('td'));

        if (columns.length < 5) {
          continue;
        }

        const date = await columns[0].getText();
        const parsedDate = parseDate(date);
        //const today = moment();

        // if (today.startOf('day').isAfter(parsedDate)) {
        //   continue;
        // }

        const debit = await columns[3].getText();
        const credit = await columns[4].getText();
        const description = await columns[2].getText();
        const amount = parseAmount(debit, credit);

        if (!amount) {
          // The amount sometimes is an empty value!
          continue;
        }

        const txn: BankTransaction = {
          amount,
          description,
          date: parsedDate.format(),
        };

        logger.info(`Found transaction for comparison ${date} ${amount} ${description}`);

        txns.push(txn);
      }
      return txns;
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
      // Todo - press button to go home first and then click on the account!
      await driver.findElement(By.css(`a[href="viewAccountPortfolio.html"]`)).click();

      // <li> data-acctalias="Amplify Signature" > h2 > a click
      logger.info(`Clicking on account [${account.accountName}]`);
      await driver.findElement(By.css(`[data-acctalias="${account.accountName}"] > h2 > a`)).click();

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
