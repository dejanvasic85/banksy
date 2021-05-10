import 'source-map-support/register';

import { Context, ScheduledHandler } from 'aws-lambda';

export const scraper: ScheduledHandler = async (event, ctx: Context) => {
  console.log('hello world', ctx.awsRequestId);
};
