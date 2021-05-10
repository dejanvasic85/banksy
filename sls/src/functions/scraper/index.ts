import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.scraper`,
  layers: [
    'arn:aws:lambda:ap-southeast-2:764866452798:layer:chrome-aws-lambda:20'
  ],
}
