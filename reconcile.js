const areEqual = (txn1, txn2) => {
  return (
    txn1.date === txn2.date &&
    txn1.amount === txn2.amount &&
    txn1.description === txn2.description
  );
};

const getMissingTransactions = ({ ynabTransactions, bankAccount }) => {
  const newTransactions = [];
  const accountTxn = bankAccount.getNextTransaction();
  const t = ynabTransactions.find(ynabTxn => areEqual(ynabTxn, accountTxn));

  if (!t) {
    console.log('not here, adding', accountTxn);
    newTransactions.push(accountTxn);
  }

  return newTransactions;
};

const accountIterator = (ynabTransactions, bankAccount) => {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          const nextTransaction = bankAccount.getNextTransaction();
          const t = ynabTransactions.find(ynabTxn =>
            areEqual(ynabTxn, nextTransaction)
          );
          if (!t) {
            return { done: false, value: nextTransaction };
          } else {
            return { done: true };
          }
        }
      };
    }
  };
};

const reconcile = ({ ynabAccount, bankAccount }) => {
  const param = {
    ynabTransactions: ynabAccount.getTransactions(),
    bankAccount
  };

  return getMissingTransactions(param);
};

module.exports = {
  getMissingTransactions,
  accountIterator,
  reconcile
};
