import { bankAccountFactory } from './bankAccountFactory';
import { getTransactions, updateTransactions } from './db/userTransactionRepository';
import { reconcile } from './reconciler';
import logger from './logger';
import { UserConfig, TransactionsMessage } from './types';
import { publish } from './publisher';

export const processUser = async (username: string, userConfig: UserConfig): Promise<void> => {
  const { banks, publisherConfig } = userConfig;
  for (const bankConfig of banks) {
    const accounts = bankConfig.accounts.filter(a => a.active);

    if (accounts.length === 0) {
      continue;
    }

    const bankCrawler = await bankAccountFactory(bankConfig);

    if (!bankCrawler) {
      continue;
    }

    logger.info(`bankAccountProcessor: Logging in to ${bankConfig.bankId}. Please wait...`);
    await bankCrawler.login();

    for (const account of accounts) {
      try {
        logger.info(`bankAccountProcessor: Processing account ${account.accountName}`);
        const { accountName } = account;
        const accountReader = await bankCrawler.getAccountReader(account);
        const now = new Date();

        const cached = await getTransactions({
          date: now,
          bankId: bankConfig.bankId,
          accountName,
          username,
        });

        const bankTransactions = await accountReader.getTodaysTransactions();
        const newTransactions = reconcile({ cachedTransactions: cached.transactions, bankTransactions });

        if (newTransactions.length > 0) {
          logger.info(`bankAccountProcessor: New Transactions. Found total of ${newTransactions.length}`);
          await updateTransactions(cached._id, newTransactions);
          const message: TransactionsMessage = {
            username,
            bankId: bankConfig.bankId,
            accountName,
            transactions: newTransactions,
          };
          await publish(publisherConfig, message);
        }
      } catch (err) {
        logger.error('An error occurred while processing. ', err);
      }
    }

    logger.info(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};
