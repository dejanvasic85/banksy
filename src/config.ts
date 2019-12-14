import * as dotenv from 'dotenv';
import { Config } from './types';

// Initialise environment variables by reading the .env file locally (if any)
dotenv.config();

export const config: Config = {
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsAccessSecret: process.env.AWS_SECRET_ACCESS_KEY,
  awsAccessRegion: process.env.AWS_REGION,
  logGroupStreamName: process.env.LOG_GROUP_STREAM_NAME,
  headlessBrowser: process.env.HEADLESS_BROWSER === 'true',
  encryptionKey: process.env.ENCRYPTION_KEY,
  mongoConnection: process.env.MONGO_CONNECTION,
  useLocalSecrets: process.env.USE_LOCAL_SECRETS === 'true',
  users: process.env.USERS.split(','),
};
