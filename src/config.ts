import * as dotenv from 'dotenv';
import { Config } from './types';

// Initialise environment variables by reading the .env file locally (if any)
dotenv.config();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  LOG_GROUP_STREAM_NAME,
  HEADLESS_BROWSER,
  ENCRYPTION_KEY,
  MONGO_CONNECTION,
  USE_LOCAL_SECRETS,
  USERS
} = process.env;

export const config: Config = {
  awsAccessKey: AWS_ACCESS_KEY_ID,
  awsAccessSecret: AWS_SECRET_ACCESS_KEY,
  awsAccessRegion: AWS_REGION,
  logGroupStreamName: LOG_GROUP_STREAM_NAME,
  headlessBrowser: HEADLESS_BROWSER === 'true',
  encryptionKey: ENCRYPTION_KEY,
  mongoConnection: MONGO_CONNECTION,
  useLocalSecrets: USE_LOCAL_SECRETS === 'true',
  users: USERS?.split(','),
};
