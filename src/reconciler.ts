import { BankTransaction } from './types';

export interface ReconcileParams {
  todaysTransactions: BankTransaction[];
  bankTransactions: BankTransaction[];
}

const areEqual = (existingTxn: BankTransaction, accountTxn: BankTransaction) => {
  if (!existingTxn || !accountTxn) {
    return false;
  }

  return existingTxn.amount === accountTxn.amount && existingTxn.description === accountTxn.description;
};

export const reconcile = ({ todaysTransactions, bankTransactions }: ReconcileParams): BankTransaction[] => {
  // Todo compare the two arrays and return new records

  if (bankTransactions.length === 0) {
    return [];
  }

  return bankTransactions.filter(bt => !todaysTransactions.some(tt => areEqual(tt, bt)));
};
