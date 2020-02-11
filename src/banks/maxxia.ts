require('chromedriver');
import { By, WebDriver, WebElement } from 'selenium-webdriver';
import { BankAccountCrawler, BankAccount, BankAccountReader } from '../types';
import { createDriver, screenshotToDisk, pause } from '../selenium';
import { decrypt } from '../encrypt';
import { parseDate, parseTextToAmount } from '../utils';

const DATE_FORMAT = 'DD MMM YYYY';

interface MaxxiaCredentials {
  username: string;
  password: string;
}

export const maxxiaCredentialReader = (credentials: string): MaxxiaCredentials => {
  const [username, password] = decrypt(credentials).split('|');
  return {
    username,
    password,
  };
};

export const maxxiaAccountReader = (driver: WebDriver, account: BankAccount): BankAccountReader => {
  return {
    getBankTransactions: async () => {
      const rows = await driver.findElements(By.css('table > tbody > tr'));
      const txns = await Promise.all(
        rows.map(async (row: WebElement) => {
          const text = await row.getText();
          const [dateText, description, accountName, amountText] = text.split('\n');

          if (accountName.trim() !== account.accountName) {
            return null;
          }

          const parsedDate = parseDate(dateText, DATE_FORMAT);
          const amount = parseTextToAmount(amountText);

          return {
            amount,
            description,
            date: parsedDate.format(),
          };
        }),
      );

      return txns.filter(Boolean);
    },
  };
};

export const maxxiaCrawler = async (credentials: string): Promise<BankAccountCrawler> => {
  const { username, password } = maxxiaCredentialReader(credentials);
  const driver = await createDriver();

  return {
    login: async (): Promise<void> => {
      await driver.get(`https://securemaxxia.com.au/SecureMaxxia/`);
      await driver
        .findElement(
          By.id('Digital_BaseTheme_wt42_block_wtActions_Digital_Patterns_wt163_block_wtUsername_wtUserNameInput'),
        )
        .sendKeys(username);
      await driver
        .findElement(
          By.id('Digital_BaseTheme_wt42_block_wtActions_Digital_Patterns_wt163_block_wtPassword_wtPasswordInput'),
        )
        .sendKeys(password);
      await driver
        .findElement(
          By.id('Digital_BaseTheme_wt42_block_wtActions_Digital_Patterns_wt163_block_wtAction_wtLoginButton'),
        )
        .click();
    },
    getAccountReader: async (account: BankAccount): Promise<BankAccountReader> => {
      const walletIcon = await driver.findElement(
        By.id(
          'Digital_BaseTheme_wt74_block_wtMainContent_Digital_Patterns_wt246_block_wtDashboardCards_Digital_Patterns_wt345_block_wtIcon',
        ),
      );

      await walletIcon.click();
      // todo - figure out how to wait using selenium here...
      await pause(5000);
      return maxxiaAccountReader(driver, account);
    },
    quit: async () => {
      await driver.quit();
    },
    screenshot: async () => {
      await screenshotToDisk(`maxxia-${Date.now()}`, driver);
    },
  };
};
