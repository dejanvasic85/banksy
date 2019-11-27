require('chromedriver');
import { Builder, By, Key, until } from 'selenium-webdriver';
import { decrypt } from './encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction } from './types';
import { config } from './config';

const LOGIN_PAGE_URL = 'https://www.my.commbank.com.au/netbank/Logon/Logon.aspx';

export const cbaCredentialReader = (key: string): any => {
  const [memberNumber, password] = decrypt(key).split('|');
  return {
    memberNumber,
    password,
  };
};

export const cbaAccountReader = (driver: any): BankAccountReader => {
  return {
    getTodaysTransactions: async (): Promise<Array<BankTransaction>> => {
      const txns = [];
      const tableBody = await driver.findElement(By.id('transactionsTableBody')).findElements();
      const rows = tableBody.findElements(By.css('tr'));
      for (const r of rows) {
        const date = await r.findElement(By.className('date')).getText();
        
      }

      return txns;
    },
    openAccount: async () => {},
  };
};

export const cbaCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { memberNumber, password } = cbaCredentialReader(credentials);
  const driver = await new Builder().forBrowser(config.browser).build();

  return {
    login: async (): Promise<void> => {
      await driver.get(LOGIN_PAGE_URL);
      await driver.findElement(By.id('txtMyClientNumber_field')).sendKeys(memberNumber);
      await driver.findElement(By.id('txtMyPassword_field')).sendKeys(password);
      await driver.findElement(By.id('btnLogon_field')).click();
    },
    getAccountReader: async (accountName: string): Promise<BankAccountReader> => {
      // Todo - use selenium to fetch the account page
      await driver.findElement(By.linkText(accountName)).click();
      return cbaAccountReader(driver);
    },
    quit: async () => {
      // Todo - use selenium to close the browser;
      await driver.quit();
    },
  };
};
