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