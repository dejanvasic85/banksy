require('chromedriver');
import { By, WebDriver, until } from 'selenium-webdriver';
import { createDriver, screenshotToDisk } from '../selenium';
import { decrypt } from '../encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from '../types';
import logger from '../logger';
import * as moment from 'moment';

const DATE_FORMAT = 'DD MMM YYYY';

const LOGIN_PAGE_URL =
  'https://banking.westpac.com.au/wbc/banking/handler?TAM_OP=login&URL=%2Fsecure%2Fbanking%2Foverview%2Fdashboard&logout=false';

interface WestpacCredentials {
  customerId: string;
  password: string;
}

const parseTextToAmount = (text: string): number => {
  const cleaned = text.trim().replace('$', '');

  return parseFloat(cleaned);
};


export const parseDate = (date: string): moment.Moment => {
  return moment(date, DATE_FORMAT);
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
    getBankTransactions: async (): Promise<BankTransaction[]> => {
      const txns: BankTransaction[] = [];
      const rowElements = await driver.wait(until.elementsLocated(By.css('tbody > tr')));

      for (const row of rowElements) {
        const columns = await row.findElements(By.css('td'));
        const dateSpan = await columns[0].findElement(By.css('span'));
        const dateText = await dateSpan.getText();
        const parsedDate = parseDate(dateText);

        if (!parsedDate.isValid()) {
          logger.warn(`westpac: Unable to parse date for transaction. Text: ${dateText}`);
          continue;
        }

        const descriptionSpan = await row.findElement(By.css('span[data-bind="text: Description"]'));
        const description = await descriptionSpan.getText();

        const amountSpan = await row.findElement(By.css('span[data-bind="html: Amount"]'));
        const amountText = await amountSpan.getText();

        txns.push({
          amount: parseTextToAmount(amountText),
          date: parsedDate.format(),
          description,
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
    screenshot: async () => {
      await screenshotToDisk(`westpac-${Date.now()}`, driver);
    },
  };
};
