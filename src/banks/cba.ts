require('chromedriver');
import * as dateFormat from 'dateformat';
import { By } from 'selenium-webdriver';
import { createDriver } from './driver';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from '../types';
import logger from '../logger';

const LOGIN_PAGE_URL = 'https://www.my.commbank.com.au/netbank/Logon/Logon.aspx';
const CBA_DATE_FORMAT = 'dd mmm yyyy';

interface CbaCredentials {
  memberNumber: string,
  password: string,
}

export const cbaCredentialReader = (key: string): CbaCredentials => {
  const [memberNumber, password] = decrypt(key).split('|');
  return {
    memberNumber,
    password,
  };
};

export const cbaAccountReader = (driver: any): BankAccountReader => {
  return {
    getTodaysTransactions: async (): Promise<BankTransaction[]> => {
      const txns = [];
      const today = dateFormat(new Date(), CBA_DATE_FORMAT);

      // Find the transaction table
      const tableBody = await driver.findElement(By.id('transactionsTableBody'));
      const rows = tableBody.findElements(By.tagName('tr'));

      for (const r of rows) {
        const date = await r.findElement(By.className('date')).getText();
        logger.info(`Comparing date netbank date ${date} to ${today}`);
        if (date === today) {
          logger.info('Found transaction');
        }
      }

      return txns;
    },
  };
};

export const cbaCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { memberNumber, password } : CbaCredentials = cbaCredentialReader(credentials);
  const driver = await createDriver();

  return {
    login: async (): Promise<void> => {
      await driver.get(LOGIN_PAGE_URL);
      await driver.findElement(By.id('txtMyClientNumber_field')).sendKeys(memberNumber);
      await driver.findElement(By.id('txtMyPassword_field')).sendKeys(password);
      await driver.findElement(By.id('btnLogon_field')).click();
    },
    getAccountReader: async (account: BankAccount): Promise<BankAccountReader> => {
      // Todo - use selenium to fetch the account page
      await driver.findElement(By.linkText(account.accountName)).click();
      return cbaAccountReader(driver);
    },
    quit: async () => {
      // Todo - use selenium to close the browser;
      await driver.quit();
    },
  };
};
