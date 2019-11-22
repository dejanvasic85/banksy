const areEqual = (existingTxn, accountTxn) => {
  if (!existingTxn || !accountTxn) {
    return false;
  }

  return (
    existingTxn.amount === accountTxn.amount &&
    existingTxn.description === accountTxn.description
  );
};

const reconcile = ({ todaysTransactions, bankTransactions }) => {
  // Todo compare the two arrays and return new records

  if (bankTransactions.length === 0) {
    return [];
  }

  return bankTransactions.filter(bt => !todaysTransactions.some(tt => areEqual(tt, bt)));
}

module.exports = {
  reconcile
};
