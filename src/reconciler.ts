import * as moment from 'moment';

import { BankTransaction, ReconcileResult, ReconcileParams } from './types';
import { config } from './config';

const cleanForStorage = (str: string): string => {
  return str
    .replace(/pending/gi, '')
    .replace(/-/g, '')
    .trim();
};

const cleanForCompare = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().trim();
};

const areEqual = (cachedTxn: BankTransaction, bankTxn: BankTransaction) => {
  if (!cachedTxn || !bankTxn) {
    return false;
  }

  const isTheSameDay = moment(bankTxn.date).diff(cachedTxn.date, 'days') === 0;

  return (
    cachedTxn.amount === bankTxn.amount &&
    cleanForCompare(cachedTxn.description) === cleanForCompare(bankTxn.description) &&
    isTheSameDay
  );
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

export const reconcile = ({ cachedTransactions, bankTransactions }: ReconcileParams): ReconcileResult => {
  const result = {
    newTxns: [],
    duplicateTxns: [],
    matchingTxns: [],
  };

  if (!bankTransactions || bankTransactions.length === 0) {
    return result;
  }

  // Fixes up the description for the incoming bank transactions (e.g. Pending... )
  const cleanedBankTxns = bankTransactions
    .filter(bt => bt.amount)
    .map(bt => {
      return {
        ...bt,
        description: cleanForStorage(bt.description),
      };
    });

  var value = cleanedBankTxns.reduce((prev: ReconcileResult, currentBankTxn: BankTransaction) => {
    const matching = cachedTransactions.find(cached => areEqual(cached, currentBankTxn));
    const duplicate = !matching ? cachedTransactions.find(cached => areSimilar(cached, currentBankTxn)) : null;

    return {
      newTxns: [...prev.newTxns, !matching && !duplicate ? currentBankTxn : null].filter(Boolean),
      matchingTxns: [...prev.matchingTxns, matching ? currentBankTxn : null].filter(Boolean),
      duplicateTxns: [...prev.duplicateTxns, duplicate ? currentBankTxn : null].filter(Boolean),
    };
  }, result);

  return value;
};
