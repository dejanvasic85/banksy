require('chromedriver');
import { Builder, By } from 'selenium-webdriver';
import { decrypt } from './encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction, BankAccount } from './types';
import { config } from './config';
import * as dateFormat from 'dateformat';
import logger from './logger';

const LOGIN_PAGE_URL = 'https://ibanking.bankofmelbourne.com.au/ibank/loginPage.action';
const BOM_DATE_FORMAT = 'dd/mm/yyyy';

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
  return isDebit ? -amount : amount;
};

const getTransactionRows = async (driver: any) => {
  // Click on the "All" tab
  await driver.findElement(By.css('[href="#transaction-all"]')).click();

  // That will render elements with 'clickable-trans' class which contain actual transactions! woohooo
  return await driver.findElements(By.css('.clickable-trans'));
}

const getPendingTransactionRows = async (driver: any) => {
  return await driver.findElements(By.css());
}

export const bomAccountReader = (driver: any, account: BankAccount): BankAccountReader => {
  return {
    getTodaysTransactions: async (): Promise<BankTransaction[]> => {
      const txns = [];
      const today = dateFormat(new Date(), BOM_DATE_FORMAT);
      const rows = account.pendingTransactionsOnly
        ? await driver.findElements(By.css('.transaction-pending > table > tbody > tr'))
        : await getPendingTransactionRows(driver);

      for (const row of rows) {
        const columns = await row.findElements(By.css('td'));
        const date = await columns[0].getText();

        if (today !== date) {
          continue;
        }

        const debit = await columns[3].getText();
        const credit = await columns[4].getText();
        const description = await columns[2].getText();
        const amount = parseAmount(debit, credit);

        txns.push({
          amount,
          description,
        });
      }
      return txns;
    },
  };
};

export const bomCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { accessNumber, securityNumber, password }: BomCredentials = bomCredentialsReader(credentials);
  const driver = await new Builder().forBrowser(config.browser).build();

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

      // <li> data-acctalias="Amplify Signature" > h2 > a click
      await driver.findElement(By.css(`[data-acctalias="${account.accountName}"] > h2 > a`)).click();
      
      return bomAccountReader(driver, account);
    },
    quit: async () => {
      // Todo - use selenium to close the browser;
      await driver.quit();
    },
  };
};
