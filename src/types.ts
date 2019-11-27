export interface BankAccount {
  accountName: string;
}

export interface Bank {
  bankId: string;
  credentials: string;
  accounts: Array<BankAccount>;
}

export interface UserConfig {
  user: string;
  banks: Array<Bank>;
}

export interface BankAccountReader {
  getTodaysTransactions(): Promise<Array<BankTransaction>>;
  openAccount(): Promise<void>;
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
