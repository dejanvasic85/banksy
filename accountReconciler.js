const areEqual = (ynabTxn, accountTxn) => {
  if (!ynabTxn || !accountTxn) {
    return false;
  }

  return (
    ynabTxn.date === accountTxn.date &&
    ynabTxn.amount === accountTxn.amount &&
    ynabTxn.description === accountTxn.description
  );
};

const accountReconciler = (ynabTransactions, bankAccount) => {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          const nextTransaction = bankAccount.getNextTransaction();
          if (!nextTransaction) {
            return { done: true }
          }

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

module.exports = {
  accountReconciler
};
