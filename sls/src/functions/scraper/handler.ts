import 'source-map-support/register';

import { Context, ScheduledHandler } from 'aws-lambda';
import chromium from 'chrome-aws-lambda';

import { login } from '@libs/bom';

export const scraper: ScheduledHandler = async (event, ctx: Context) => {
  const { args, headless, puppeteer } = chromium;

  const path = await chromium.executablePath;

  console.log('STARTING ... EXECUTABLE PATH', path);

  const browser = await puppeteer.launch({
    args,
    executablePath: await chromium.executablePath,
    defaultViewport: { height: 1000, width: 1200 },
    headless,
    ignoreHTTPSErrors: true,
  });

  await login(browser);
};
