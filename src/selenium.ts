import { WebDriver } from "selenium-webdriver";
import { writeFileSync } from 'fs';

export const screenshotToDisk = async (imgName: string, driver : WebDriver) : Promise<void> => {
  const img = await driver.takeScreenshot();
  writeFileSync(`${imgName}.png`, img, 'base64');
}