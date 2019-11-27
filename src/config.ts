import * as dotenv from 'dotenv';
dotenv.config();

export interface Config {
  browser: string;
  encryptionKey: string,
  mongoConnection: string,
  users: [{
    user: string,
    key: string
  }]
}

export const config: Config = {
  browser: 'chrome',
  encryptionKey: process.env.ENCRYPTION_KEY,
  mongoConnection: process.env.MONGO_CONNECTION,
  users: [
    {
      user: 'dejan',
      key: 'dejan-cba'
    }
  ]
};
