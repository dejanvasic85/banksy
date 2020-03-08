import { BankTransaction } from './types';
import * as moment from 'moment';

export interface ReconcileParams {
  startOfMonth: moment.Moment;
  cachedTransactions: BankTransaction[];
  bankTransactions: BankTransaction[];
}

const clean = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace('pending', '')
    .replace('-', '')
    .trim();
}; 

const areEqual = (existingTxn: BankTransaction, accountTxn: BankTransaction) => {
  if (!existingTxn || !accountTxn) {
    return false;
  }

  return (
    existingTxn.amount === accountTxn.amount &&
    clean(existingTxn.description) === clean(accountTxn.description) &&
    existingTxn.date === accountTxn.date
  );
};

export const reconcile = ({
  startOfMonth,
  cachedTransactions,
  bankTransactions,
}: ReconcileParams): BankTransaction[] => {
  if (bankTransactions.length === 0) {
    return [];
  }

  if (!cachedTransactions) {
    // return all
    return bankTransactions;
  }

  return bankTransactions
    .filter(({ date }) => moment(date).isSameOrAfter(startOfMonth))
    .filter(bt => !cachedTransactions.some(tt => areEqual(tt, bt)));
};