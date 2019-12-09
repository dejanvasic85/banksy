import * as dotenv from 'dotenv';
dotenv.config();

export interface Config {
  headlessBrowser: boolean;
  encryptionKey: string;
  mongoConnection: string;
  sumoLogicUrl: string;
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
  sumoLogicUrl: process.env.SUMO_HTTP_URL,
  users: [
    {
      user: 'dejan',
      secretKey: 'dejan-cba',
    },
  ],
};
