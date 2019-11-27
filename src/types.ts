export interface BankAccount {
  accountName: string
}

export interface Bank {
  bankId: string,
  credentials: string,
  accounts: [BankAccount]
}

export interface UserConfig {
  user: string,
  banks: [Bank]
}

export interface BankAccountReader {
  getTodaysTransactions() : Promise<[BankTransaction]>,
  openAccount() : Promise<void>
}

export interface BankAccountCrawler {
  login(): Promise<void>,
  getAccountReader(accountName: string): Promise<BankAccountReader>
  quit(): Promise<void>
}

export interface BankTransaction {
  amount: number,
  description: string
}