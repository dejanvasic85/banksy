require('chromedriver');
import * as dateFormat from 'dateformat';
import { By, WebElement, WebDriver, until } from 'selenium-webdriver';
import { createDriver } from './driver';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from '../types';
import logger from '../logger';

const LOGIN_PAGE_URL = 'https://www.my.commbank.com.au/netbank/Logon/Logon.aspx';
const CBA_DATE_FORMAT = 'dd mmm yyyy';

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

const parseTextToAmount = (text: string) : number => {
  const cleaned = text
    .trim()
    .replace(' ', '')
    .replace('$', '')
    .replace('-', '')
    .replace('+', '')
    .replace(',', '');

  return parseFloat(cleaned);
}

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

  logger.info('classNames');

  return classNames.indexOf('currencyUIDebit') > 0
    ? -(amount)
    : amount;
};

export const cbaAccountReader = (driver: WebDriver, account: BankAccount): BankAccountReader => {
  return {
    getTodaysTransactions: async (): Promise<BankTransaction[]> => {
      const txns = [];
      const today = dateFormat(new Date(), CBA_DATE_FORMAT);
      const rows = await driver.wait(until.elementsLocated(By.css('[data-issynced]')));
      logger.info(`Found [${rows.length}] rows for account [${account.accountName}] `);

      for (const r of rows) {
        const date = await r.findElement(By.className('date')).getText();
        const description = await r.findElement(By.className('original_description')).getText();
        const amount = await getAmount(r);

        if (date === today) {
          logger.info('Found transaction');
          const txn : BankTransaction = {
            amount,
            description
          }

          txns.push(txn);
        }
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
      // Todo - use selenium to close the browser;
      await driver.quit();
    },
  };
};
