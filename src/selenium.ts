require('chromedriver');
import * as chrome from 'selenium-webdriver/chrome';
import { Builder, WebDriver } from 'selenium-webdriver';
import { config } from './config';
import { writeFileSync } from 'fs';
import logger from './logger';

export const createDriver = async (): Promise<WebDriver> => {
  const screen = {
    width: 1200,
    height: 1000,
  };

  const builder = await new Builder().forBrowser('chrome');
  const chromeOptions = new chrome.Options().windowSize(screen);

  if (config.headlessBrowser) {
    logger.info('selenium: Using headless browser.');
    chromeOptions.headless();
  }

  return builder.setChromeOptions(chromeOptions).build();
};

export const screenshotToDisk = async (imgName: string, driver: WebDriver): Promise<void> => {
  const img = await driver.takeScreenshot();
  writeFileSync(`./screenshots/${imgName}.png`, img, 'base64');
};

export const textContains = (text: string, textToCompare: string): boolean => {
  return (
    text
      .trim()
      .toLowerCase()
      .indexOf(textToCompare.trim().toLowerCase()) >= 0
  );
};
