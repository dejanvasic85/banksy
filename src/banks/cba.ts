require('chromedriver');
import * as moment from 'moment';
import { By, WebElement, WebDriver, until } from 'selenium-webdriver';
import { createDriver, screenshotToDisk } from '../selenium';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from '../types';
import logger from '../logger';

const LOGIN_PAGE_URL = 'https://www.my.commbank.com.au/netbank/Logon/Logon.aspx';
const CBA_DATE_FORMAT = 'DD MMM YYYY';

interface CbaCredentials {
  memberNumber: string;
  password: string;
}

export const cbaCredentialReader = (key: string): CbaCredentials => {
  const [memberNumber, password] = decrypt(key).split('|');
  return {
    memberNumber,
    password,
  };
};

const parseTextToAmount = (text: string): number => {
  const cleaned = text
    .trim()
    .replace(' ', '')
    .replace('$', '')
    .replace('-', '')
    .replace('+', '')
    .replace(',', '');

  return parseFloat(cleaned);
};

const parseDate = (text: string): moment.Moment => {
  return moment(text, CBA_DATE_FORMAT);
};

const getAmount = async (row: WebElement): Promise<number> => {
  const columns = await row.findElements(By.css('td'));
  const amountColumn = columns[3];
  const currencyElement = await amountColumn.findElement(By.className('currencyUI'));
  const text = await currencyElement.getText();

  if (text.length === 0) {
    logger.error('Uhmmm there is no text in this amount element');
    return null;
  }

  const amount = parseTextToAmount(text);
  if (Number.isNaN(amount)) {
    return null;
  }

  const classNames = await currencyElement.getAttribute('class');
  return classNames.indexOf('currencyUIDebit') > 0 ? -amount : amount;
};

export const cbaAccountReader = (driver: WebDriver, { accountName }: BankAccount): BankAccountReader => {
  return {
    getBankTransactions: async (): Promise<BankTransaction[]> => {
      const txns = [];

      const rows = await driver.wait(until.elementsLocated(By.css('[data-issynced]')));

      for (const r of rows) {
        const date = await r.findElement(By.className('date')).getText();
        const parsedDate = parseDate(date);
        const descriptionElement = await r.findElement(By.css('.original_description'));
        const description = (await descriptionElement.getAttribute('innerHTML')).replace('<br>', ' ');
        const amount = await getAmount(r);

        if (!parsedDate.isValid()) {
          logger.warn(`Unable to parse date for transaction. Text: ${date}`);
          continue;
        }

        txns.push({
          amount,
          description: description.substr(0, 100),
          date: parsedDate.format(),
        });
      }

      return txns;
    },
  };
};

export const cbaCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { memberNumber, password }: CbaCredentials = cbaCredentialReader(credentials);
  const driver = await createDriver();

  return {
    login: async (): Promise<void> => {
      await driver.get(LOGIN_PAGE_URL);
      await driver.findElement(By.id('txtMyClientNumber_field')).sendKeys(memberNumber);
      await driver.findElement(By.id('txtMyPassword_field')).sendKeys(password);
      await driver.findElement(By.id('btnLogon_field')).click();
    },
    getAccountReader: async (account: BankAccount): Promise<BankAccountReader> => {
      const homeLink = await driver.wait(until.elementLocated(By.linkText('My home')));
      await homeLink.click();

      const link = await driver.wait(until.elementLocated(By.linkText(account.accountName)));
      await link.click();

      return cbaAccountReader(driver, account);
    },
    quit: async () => {
      await driver.quit();
    },
    screenshot: async () => {
      await screenshotToDisk(`cba-${Date.now()}`, driver);
    },
  };
};
