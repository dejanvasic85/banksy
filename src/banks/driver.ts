require('chromedriver');

import * as chrome from 'selenium-webdriver/chrome';
import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import { config } from '../config';

export const createDriver = async (): Promise<WebDriver> => {
  const screen = {
    width: 640,
    height: 480,
  };

  const builder = await new Builder().forBrowser('chrome');

  if (config.headlessBrowser) {
    builder.setChromeOptions(new chrome.Options().headless().windowSize(screen));
  }

  return builder.build();
};
