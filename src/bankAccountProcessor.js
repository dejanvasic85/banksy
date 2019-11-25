const { bankAccountFactory } = require('./bankAccountFactory');
const { getTransactions, saveTransactions } = require('./db/userTransactionRepository');
const { reconcile } = require('./reconciler');
const logger = require('./logger');

const processUser = async ({ user, banks }) => {
  for (const bankConfig of banks) {
    const bankCrawler = bankAccountFactory(bankConfig);

    if (!bankCrawler) {
      continue;
    }

    for (account of bankConfig.accounts) {
      try {

        const { accountName } = account;

        console.log(`Logging in to ${bankConfig.bankId}. Please wait...`);
        await bankCrawler.login();

        console.log(`Opening account ${accountName}. Please wait ....`);
        const accountReader = await bankCrawler.getAccountReader(accountName);
        const todaysTransactions = await getTransactions({ user, accountName });
        const bankTransactions = await accountReader.getTodaysTransactions();
        const newTransactions = reconcile({ todaysTransactions, bankTransactions });
        await saveTransactions({ user, accountName, newTransactions });

      } catch(err){
        logger.error('An error occurred while processing', err);
      }
    }

    console.log(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};

module.exports = {
  processUser
};