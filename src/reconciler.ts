import { BankTransaction, ReconcileResult, ReconcileParams } from './types';

const cleanForStorage = (str: string): string => {
  return str
    .replace(/pending/gi, '')
    .replace(/-/g, '')
    .trim();
};

const cleanForCompare = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim();
};

const areEqual = (cachedTxn: BankTransaction, bankTxn: BankTransaction) => {
  if (!cachedTxn || !bankTxn) {
    return false;
  }

  return (
    cachedTxn.amount === bankTxn.amount &&
    cleanForCompare(cachedTxn.description) === cleanForCompare(bankTxn.description)
  );
};

export const reconcile = ({ cachedTransactions, bankTransactions }: ReconcileParams): ReconcileResult => {
  const result = {
    newTransactions: [],
    duplicates: [],
  };

  if (!bankTransactions || bankTransactions.length === 0) {
    return result;
  }

  if (!cachedTransactions) {
    result.newTransactions = bankTransactions;
    return result;
  }

  const cleanedBankTransactions = bankTransactions.map(bt => {
    return {
      ...bt,
      description: cleanForStorage(bt.description),
    };
  });

  cleanedBankTransactions.forEach(bt => {
    const matchingCachedTransactions = cachedTransactions.filter(ct => areEqual(ct, bt));

    if (matchingCachedTransactions.length > 0) {
      result.duplicates.push(bt);
    } else {
      result.newTransactions.push(bt);
    }
  });

  return result;
};
