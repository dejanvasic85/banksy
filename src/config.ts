import * as dotenv from 'dotenv';
dotenv.config();

export interface Config {
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
