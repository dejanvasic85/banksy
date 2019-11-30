export interface BankAccount {
  accountName: string;
  active: boolean;
}

export interface Bank {
  bankId: string;
  credentials: string;
  accounts: BankAccount[];
}

export interface UserConfig {
  user: string;
  banks: Bank[];
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
