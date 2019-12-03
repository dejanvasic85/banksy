import { BankTransaction } from './types';

export interface ReconcileParams {
  cachedTransactions: BankTransaction[];
  bankTransactions: BankTransaction[];
}

const areEqual = (existingTxn: BankTransaction, accountTxn: BankTransaction) => {
  if (!existingTxn || !accountTxn) {
    return false;
  }

  return existingTxn.amount === accountTxn.amount && existingTxn.description === accountTxn.description;
};

export const reconcile = ({ cachedTransactions, bankTransactions }: ReconcileParams): BankTransaction[] => {
  if (bankTransactions.length === 0) {
    return [];
  }

  if (!cachedTransactions) {
    // return all
    return bankTransactions;
  }

  return bankTransactions.filter(bt => !cachedTransactions.some(tt => areEqual(tt, bt)));
};