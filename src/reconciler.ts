import * as moment from 'moment';

import { BankTransaction, ReconcileResult, ReconcileParams } from './types';
import { config } from './config';

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

const areSimilar = (cachedTxn: BankTransaction, bankTxn: BankTransaction) => {
  if (!cachedTxn || !bankTxn) {
    return false;
  }

  const daysDiff = moment(bankTxn.date).diff(cachedTxn.date, 'days');
  const isInDateRange = daysDiff > 0 && daysDiff <= config.daysToMatchDuplicateTxns;
  const cachedDescription = cleanForCompare(cachedTxn.description).substr(0, 10);
  const bankDescription = cleanForCompare(bankTxn.description).substr(0, 10);

  return cachedTxn.amount === bankTxn.amount && cachedDescription === bankDescription && isInDateRange;
};

const isNotFutureDate = ({ date }: BankTransaction): boolean => {
  return moment(date).isSameOrBefore(moment());
};

export const reconcile = ({ cachedTransactions, bankTransactions }: ReconcileParams): ReconcileResult => {
  const result = {
    newTxns: [],
    duplicateTxns: [],
    matchingTxns: [],
  };

  if (!bankTransactions || bankTransactions.length === 0) {
    return result;
  }

  var value = bankTransactions.filter(isNotFutureDate).reduce((prev: ReconcileResult, currentTxn: BankTransaction) => {
    const matching = cachedTransactions.find((cached) => areEqual(cached, currentTxn));
    const duplicate = matching ? null : cachedTransactions.find((cached) => areSimilar(cached, currentTxn));

    return {
      newTxns: [...prev.newTxns, !matching && !duplicate ? currentTxn : null].filter(Boolean),
      matchingTxns: [...prev.matchingTxns, matching ? currentTxn : null].filter(Boolean),
      duplicateTxns: [...prev.duplicateTxns, duplicate ? currentTxn : null].filter(Boolean),
    };
  }, result);

  return value;
};
