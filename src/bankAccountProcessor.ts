import { bankAccountFactory } from './bankAccountFactory';
import { getTransactions } from './db/userTransactionRepository';
//import { reconcile } from './reconciler';
import * as logger from './logger';
import { UserConfig } from './types';

export const processUser = async ({ user, banks }: UserConfig) => {
  for (const bankConfig of banks) {
    const bankCrawler = bankAccountFactory(bankConfig);

    if (!bankCrawler) {
      continue;
    }

    for (const account of bankConfig.accounts) {
      try {
        const { accountName } = account;

        console.log(`Logging in to ${bankConfig.bankId}. Please wait...`);
        await bankCrawler.login();

        console.log(`Opening account ${accountName}. Please wait ....`);
        const accountReader = await bankCrawler.getAccountReader(accountName);
        const now = new Date();

        const todaysTransactions = await getTransactions({
          date: now,
          bankId: bankConfig.bankId,
          accountName,
          user,
        });
        // const bankTransactions = await accountReader.getTodaysTransactions();
        // const newTransactions = reconcile({ todaysTransactions, bankTransactions });
        // await saveTransactions({ user, accountName, newTransactions });
      } catch (err) {
        logger.error('An error occurred while processing', err);
      }
    }

    console.log(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};
