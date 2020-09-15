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

const getRowData = async (cols: WebElement[]) => {
  let data: string[] = [];
  for (const c of cols) {
    const text = await c.getAttribute('textContent');
    data.push(text.trim());
  }
  return data;
};

export const maxxiaAccountReader = (driver: WebDriver, account: BankAccount): BankAccountReader => {
  return {
    getBankTransactions: async () => {
      const rows = await driver.findElements(By.css('table > tbody > tr'));
      const txns = await Promise.all(
        rows.map(async (row: WebElement) => {
          const cols = await row.findElements(By.css('td'));
          const rowData = await getRowData(cols);
          const [dateText, description, accountName, amountText] = rowData;

          if (accountName !== account.accountName) {
            return null;
          }

          const parsedDate = parseDate(dateText, DATE_FORMAT);
          const amount = parseTextToAmount(amountText);

          return {
            amount,
            description: description.trim(),
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

      // Sometimes a little dialog appears after 2 seconds. Check if that is the case and close it first
      await pause(3000);

      const closeBtn = await driver.findElements(By.css('.norfolk-ClosePosition--top-right > svg'));
      if (closeBtn.length > 0) {
        await closeBtn[0].click();
      }

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
      await driver.get(
        'https://securemaxxia.com.au/SecureMaxxia/Transactions.aspx?SelectedBenefitId=1652966&IsSourceDashboard=True',
      );

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
