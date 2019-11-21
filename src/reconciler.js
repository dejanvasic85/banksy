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

const reconcile = ({ todaysTransactions, bankTransactions }) => {
  // Todo compare the two arrays and return new records
  return [];
}

module.exports = {
  reconcile
};
