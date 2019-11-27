import { bankAccountFactory } from './bankAccountFactory';
import { getTransactions } from './db/userTransactionRepository';
import { reconcile } from './reconciler';
import * as logger from './logger';
import { UserConfig } from './types';

export const processUser = async ({ user, banks }: UserConfig) : Promise<void> => {
  for (const bankConfig of banks) {
    const bankCrawler = bankAccountFactory(bankConfig);
    
    if (!bankCrawler) {
      continue;
    }

    logger.info(`Logging in to ${bankConfig.bankId}. Please wait...`);
    await bankCrawler.login();

    for (const account of bankConfig.accounts) {
      try {
        const { accountName } = account;
        const accountReader = await bankCrawler.getAccountReader(accountName);
        const now = new Date();

        const cachedTransactions = await getTransactions({
          date: now,
          bankId: bankConfig.bankId,
          accountName,
          user,
        });
        
        const bankTransactions = await accountReader.getTodaysTransactions();

        // const newTransactions = reconcile({ todaysTransactions, bankTransactions });
        // await saveTransactions({ user, accountName, newTransactions });
      } catch (err) {
        logger.error('An error occurred while processing', err);
      }
    }

    logger.info(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};
