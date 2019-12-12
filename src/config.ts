import * as dotenv from 'dotenv';
dotenv.config();

export interface Config {
  awsAccessKey: string;
  awsAccessSecret: string;
  awsAccessRegion: string;
  logGroupStreamName: string;
  headlessBrowser: boolean;
  encryptionKey: string;
  mongoConnection: string;
  useLocalSecrets: boolean;
  users: [
    {
      user: string;
      secretKey: string;
    },
  ];
}

export const config: Config = {
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsAccessSecret: process.env.AWS_SECRET_ACCESS_KEY,
  awsAccessRegion: process.env.AWS_REGION,
  logGroupStreamName: process.env.LOG_GROUP_STREAM_NAME,
  headlessBrowser: process.env.HEADLESS_BROWSER === 'true',
  encryptionKey: process.env.ENCRYPTION_KEY,
  mongoConnection: process.env.MONGO_CONNECTION,
  useLocalSecrets: process.env.USE_LOCAL_SECRETS === 'true',
  users: [
    {
      user: 'dejan',
      secretKey: 'dejan-cba',
    },
  ],
};
