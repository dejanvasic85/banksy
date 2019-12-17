require('chromedriver');
import * as dateFormat from 'dateformat';
import { By, WebElement, WebDriver, until } from 'selenium-webdriver';
import { createDriver } from './driver';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from '../types';
import logger from '../logger';

const LOGIN_PAGE_URL =
  'https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&URL=%2Fsecure%2Fbanking%2Foverview%2Fdashboard&logout=false';
const CBA_DATE_FORMAT = 'dd mmm yyyy';

interface WestpacCredentials {
  customerId: string;
  password: string;
}

const pause = (ms: number) : Promise<void> => {
  return new Promise(res => setTimeout(res, ms));
}

export const westpacCredentialReader = (key: string): WestpacCredentials => {
  const [customerId, password] = decrypt(key).split('|');
  return {
    customerId,
    password,
  };
};

export const westpacAccountReader = (driver: WebDriver, account: BankAccount): BankAccountReader => {
  return {
    getTodaysTransactions: async (): Promise<BankTransaction[]> => {
      const txns = [];
      // Todo - coming soon
      return txns;
    },
  };
};

export const westpacCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { customerId, password }: WestpacCredentials = westpacCredentialReader(credentials);
  const driver = await createDriver();

  return {
    login: async (): Promise<void> => {
      await driver.get(LOGIN_PAGE_URL);
      await driver.findElement(By.id('fakeusername')).sendKeys(customerId);
      await driver.findElement(By.id('password')).sendKeys(password);
      await pause(3000);
      await driver.findElement(By.id('signin')).click();
    },

    getAccountReader: async (account: BankAccount): Promise<BankAccountReader> => {
      await pause(12000);
      // const homeLink = await driver.wait(until.elementLocated(By.linkText('My home')));
      // await homeLink.click();

      // const link = await driver.wait(until.elementLocated(By.linkText(account.accountName)));
      // await link.click();

      return westpacAccountReader(driver, account);
    },

    quit: async () => {
      await driver.quit();
    },
  };
};