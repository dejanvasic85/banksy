export interface Config {
  awsAccessKey: string;
  awsAccessSecret: string;
  awsAccessRegion: string;
  logGroupStreamName: string;
  headlessBrowser: boolean;
  encryptionKey: string;
  mongoConnection: string;
  useLocalSecrets: boolean;
  users: string[];
}

export interface BankAccount {
  accountName: string;
  active: boolean;
  pendingTransactionsOnly?: boolean;
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
  getTodaysTransactions(): Promise<BankTransaction[]>;
}

export interface BankAccountCrawler {
  login(): Promise<void>;
  getAccountReader(account: BankAccount): Promise<BankAccountReader>;
  quit(): Promise<void>;
}

export interface BankTransaction {
  amount: number;
  description: string;
  date?: string;
}

export interface TransactionsMessage {
  username: string;
  bankId: string;
  accountName: string;
  transactions: BankTransaction[];
}
