import { bankAccountFactory } from './bankAccountFactory';
import { getTransactions, updateTransactions } from './db/userTransactionRepository';
import { reconcile } from './reconciler';
import logger from './logger';
import { UserConfig } from './types';
import { publish } from './publisher';

export const processUser = async ({ user, banks, publisherConfig }: UserConfig): Promise<void> => {
  for (const bankConfig of banks) {
    const accounts = bankConfig.accounts.filter(a => a.active);

    if (accounts.length === 0) {
      continue;
    }

    const bankCrawler = await bankAccountFactory(bankConfig);

    if (!bankCrawler) {
      continue;
    }

    logger.info(`Logging in to ${bankConfig.bankId}. Please wait...`);
    await bankCrawler.login();

    for (const account of accounts) {
      try {
        const { accountName } = account;
        const accountReader = await bankCrawler.getAccountReader(accountName);
        const now = new Date();

        const cached = await getTransactions({
          date: now,
          bankId: bankConfig.bankId,
          accountName,
          user,
        });

        const bankTransactions = await accountReader.getTodaysTransactions();

        logger.info('Found transactions', bankTransactions);

        const newTransactions = reconcile({ cachedTransactions: cached.transactions, bankTransactions });
        if (newTransactions.length > 0) {
          logger.info(`New Transactions. Found total ${newTransactions.length}`);
          await updateTransactions(cached._id, newTransactions);
          await publish(publisherConfig, newTransactions);
        }
      } catch (err) {
        logger.error('An error occurred while processing', err);
      }
    }

    logger.info(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};
