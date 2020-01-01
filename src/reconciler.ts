import { BankTransaction } from './types';
import * as moment from 'moment';

export interface ReconcileParams {
  startOfMonth: moment.Moment;
  cachedTransactions: BankTransaction[];
  bankTransactions: BankTransaction[];
}

const areEqual = (existingTxn: BankTransaction, accountTxn: BankTransaction) => {
  if (!existingTxn || !accountTxn) {
    return false;
  }

  return (
    existingTxn.amount === accountTxn.amount &&
    existingTxn.description === accountTxn.description &&
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
