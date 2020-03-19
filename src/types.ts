import * as mongoose from 'mongoose';

export interface UserTransactionsModel extends mongoose.Document {
  _id: string;
  transactions: [
    {
      amount: number;
      date: string;
      description: string;
    },
  ];
}

export interface Config {
  awsAccessKey: string;
  awsAccessSecret: string;
  awsAccessRegion: string;
  logGroupName: string;
  logGroupStreamName: string;
  headlessBrowser: boolean;
  encryptionKey: string;
  mongoConnection: string;
  useLocalSecrets: boolean;
  users: string[];

  pg: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
  };
}

export interface BankAccount {
  accountName: string;
  active: boolean;
}

export interface Bank {
  bankId: string;
  credentials: string;
  accounts: BankAccount[];
}

export interface PublisherConfig {
  type: string;
  address: string;
}

export interface Publisher {
  publish: (data: string, address: string) => Promise<void>;
}

export interface UserConfig {
  banks: Bank[];
  publisherConfig: PublisherConfig;
}

export interface BankAccountReader {
  getBankTransactions(): Promise<BankTransaction[]>;
}

export interface BankAccountCrawler {
  screenshot();
  login(): Promise<void>;
  getAccountReader(account: BankAccount): Promise<BankAccountReader>;
  quit(): Promise<void>;
}

export interface BankTransaction {
  amount: number;
  description: string;
  date: string;
}

export interface TransactionsMessage {
  username: string;
  bankId: string;
  accountName: string;
  transactions: BankTransaction[];
}

export interface ColumnIndexes {
  dateIndex: number;
  descriptionIndex: number;
  debitIndex: number;
  creditIndex: number;
}
