const areEqual = (existingTxn, accountTxn) => {
  if (!existingTxn || !accountTxn) {
    return false;
  }

  return (
    existingTxn.date === accountTxn.date &&
    existingTxn.amount === accountTxn.amount &&
    existingTxn.description === accountTxn.description
  );
};

const accountReconciler = (knownTransactions, bankAccount) => {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          const nextTransaction = bankAccount.getNextTransaction();
          if (!nextTransaction) {
            return { done: true }
          }

          const t = knownTransactions.find(ynabTxn =>
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
