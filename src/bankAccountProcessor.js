const ynab = require('ynab');
const { bankAccountFactory } = require('./bankAccountFactory');
const { accountReconciler } = require('./accountReconciler');

const processUser = async ({ ynabKey, budgetId, banks }) => {
  const ynabAPI = new ynab.API(ynabKey);

  for (const bankConfig of banks) {
    const bankCrawler = bankAccountFactory(bankConfig);

    if (!bankCrawler) {
      continue;
    }

    for (account of bankConfig.accounts) {
      const { accountName } = account;
      
      console.log(`Logging in to ${bankConfig.bankId}. Please wait...`);
      await bankCrawler.login();

      console.log(`Opening account ${accountName}. Please wait ....`);
      await bankCrawler.getAccountReader(accountName);

      //const ynabTransactions = ynabAPI.transactions.getTransactionsByAccount(budgetId, accountId);

      // for (t in accountReconciler(ynabTransactions, accountReader)) {
      //   // Todo - Add the transaction in to YNAB
      // }
    }

    console.log(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};

module.exports = {
  processUser
};