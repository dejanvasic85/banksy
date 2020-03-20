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
  screenshot: () => Promise<void>;
  login: () => Promise<void>;
  getAccountReader: (account: BankAccount) => Promise<BankAccountReader>;
  quit: () => Promise<void>;
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
  duplicates: BankTransaction[];
}

export interface ColumnIndexes {
  dateIndex: number;
  descriptionIndex: number;
  debitIndex: number;
  creditIndex: number;
}

export interface ReconcileParams {
  cachedTransactions: BankTransaction[];
  bankTransactions: BankTransaction[];
}

export interface ReconcileResult {
  newTransactions: BankTransaction[];
  duplicates: BankTransaction[];
}
