export interface BankAccount {
  accountName: string;
  active: boolean;
  pendingTransactionsOnly: boolean;
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
  user: string;
  banks: Bank[];
  publisherConfig: PublisherConfig;
}

export interface BankAccountReader {
  getTodaysTransactions(): Promise<BankTransaction[]>;
}

export interface BankAccountCrawler {
  login(): Promise<void>;
  getAccountReader(accountName: string): Promise<BankAccountReader>;
  quit(): Promise<void>;
}

export interface BankTransaction {
  amount: number;
  description: string;
}
