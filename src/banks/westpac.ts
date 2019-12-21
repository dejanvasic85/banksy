require('chromedriver');
import * as dateFormat from 'dateformat';
import { By, WebElement, WebDriver, until } from 'selenium-webdriver';
import { createDriver } from './driver';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from '../types';
import logger from '../logger';

const DATE_FORMAT = 'dd mmm yyyy';

const today = dateFormat(new Date(), DATE_FORMAT);

const LOGIN_PAGE_URL =
  'https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&URL=%2Fsecure%2Fbanking%2Foverview%2Fdashboard&logout=false';

interface WestpacCredentials {
  customerId: string;
  password: string;
}

const parseTextToAmount = (text: string) : number => {
  const cleaned = text
    .trim()
    .replace('$', '');

  return parseFloat(cleaned);
}

const pause = (ms: number): Promise<void> => {
  return new Promise(res => setTimeout(res, ms));
};

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
      logger.info('Getting transactions...');
      const txns : BankTransaction[] = [];
      const rowElements = await driver.wait(until.elementsLocated(By.css('tbody > tr')));

      for (const row of rowElements) {
        const columns = await row.findElements(By.css('td'));
        const dateSpan = await columns[0].findElement(By.css('span'));
        const date = await dateSpan.getText();

        // if (today !== date) {
        //   continue;
        // }

        const descriptionSpan = await row.findElement(By.css('span[data-bind="text: Description"]'));
        const description = await descriptionSpan.getText();

        const amountSpan = await row.findElement(By.css('span[data-bind="html: Amount"]'));
        const amountText = await amountSpan.getText();

        txns.push({
          date,
          amount: parseTextToAmount(amountText),
          description
        });
      }
      
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
      await driver.findElement(By.id('signin')).click();
    },

    getAccountReader: async (account: BankAccount): Promise<BankAccountReader> => {
      const homeLink = await driver.wait(until.elementLocated(By.css('#logo a')));
      await homeLink.click();

      const accountLinks = await driver.wait(until.elementsLocated(By.css('.tiles h2')));
      let link = null;
      for (const linkElement of accountLinks) {
        const text = await linkElement.getText();
        if (text.trim() === account.accountName.trim()) {
          link = linkElement;
          break;
        }
      }

      if (!link) {
        throw new Error(`Unable to locate the account link ${account.accountName}`);
      }
      await link.click();
      return westpacAccountReader(driver, account);
    },

    quit: async () => {
      await driver.quit();
    },
  };
};
