const ynab = require('ynab');
const { bankAccountFactory } = require('./bankAccountFactory');
const { accountReconciler } = require('./accountReconciler');

const processUser = async ({ ynabKey, budgetId, banks }) => {
  const ynabAPI = new ynab.API(ynabKey);

  for ({ bankId, credentials, accounts } in banks) {
    const accountReader = await bankAccountFactory(bankId, credentials);

    for (a in accounts) {
      await accountReader.openAccount();
      const ynabTransactions = ynabAPI.transactions.getTransactionsByAccount(budgetId, accountId);

      for (t in accountReconciler(ynabTransactions, accountReader)) {
        // Todo - Add the transaction in to YNAB
      }
    }
  }
};

const processAll = () => {

}

module.exports = {
  processAll,
  processUser
};