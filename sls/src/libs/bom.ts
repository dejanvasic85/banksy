import { Browser } from 'puppeteer-core';

const LOGIN_PAGE_URL = 'https://ibanking.bankofmelbourne.com.au/ibank/loginPage.action';
const deets = {
  accessNumber: 'xxx',
  securityNumber: 'xxx',
  password: 'xxx',
};

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';

export const login = async (browser: Browser): Promise<void> => {
  const page = await browser.newPage();

  page.setUserAgent(userAgent);
  await page.goto(LOGIN_PAGE_URL);

  console.log('Filling login details...');

  const customerNumber = await page.$('#access-number');
  await customerNumber.type(deets.accessNumber);

  const securityNumber = await page.$('#securityNumber');
  await securityNumber.type(deets.securityNumber);

  const password = await page.$('#internet-password');
  await password.type(deets.password);

  const loginButton = await page.$('#logonButton');
  await loginButton.click();

  console.log('Logging in... waiting for navigation');

  await page.waitForNavigation();

  const pageTitle = await page.title();
  const currentUrl = page.url();
  console.log('We are now on URL:', currentUrl, pageTitle);
};
