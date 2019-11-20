const { bankAccountFactory } = require('./bankAccountFactory');
const { getTransactions, saveTransactions } = require('./transactionRepository');
const { reconcile } = require('./reconciler');

const processUser = async ({ user, banks }) => {
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
      const accountReader = await bankCrawler.getAccountReader(accountName);
      const todaysTransactions = await getTransactions({ user, accountName });
      const bankTransactions = await accountReader.getTodaysTransactions();
      const newTransactions = reconcile({ todaysTransactions, bankTransactions });
      await saveTransactions({ user, accountName, newTransactions });
    }

    console.log(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};

module.exports = {
  processUser
};