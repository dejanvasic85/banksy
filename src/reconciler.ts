import * as moment from 'moment';

import { BankTransaction, ReconcileResult, ReconcileParams } from './types';

const cleanForCompare = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().trim();
};

const areEqual = (cachedTxn: BankTransaction, bankTxn: BankTransaction) => {
  if (!cachedTxn || !bankTxn) {
    return false;
  }

  const isTheSameDay = moment(bankTxn.date).diff(cachedTxn.date, 'days') === 0;
  const isTheSameAmount = cachedTxn.amount === bankTxn.amount;
  const isTheSameDesc = cleanForCompare(cachedTxn.description) === cleanForCompare(bankTxn.description);
  return isTheSameAmount && isTheSameDesc && isTheSameDay;
};

export const reconcile = ({ cachedTransactions, bankTransactions }: ReconcileParams): ReconcileResult => {
  const result = {
    newTxns: [],
  };

  if (!bankTransactions || bankTransactions.length === 0) {
    return result;
  }

  var value = bankTransactions.reduce((prev: ReconcileResult, currentTxn: BankTransaction) => {
    const matching = cachedTransactions.find((cached) => areEqual(cached, currentTxn));

    return {
      newTxns: [...prev.newTxns, !matching ? currentTxn : null].filter(Boolean),
    };
  }, result);

  return value;
};
