import { bankAccountFactory } from './bankAccountFactory';
import { getTransactions, updateTransactions } from './db/userTransactionRepository';
import { reconcile } from './reconciler';
import logger from './logger';
import { UserConfig, TransactionsMessage, BankAccount, BankAccountCrawler, PublisherConfig } from './types';
import { publish } from './publisher';
import { getStartOfMonth } from './startOfMonth';

export const processBankAccount = async (
  username: string,
  bankId: string,
  account: BankAccount,
  bankCrawler: BankAccountCrawler,
  publisherConfig: PublisherConfig,
): Promise<void> => {
  try {
    logger.info(`bankAccountProcessor: Processing account ${account.accountName}`);
    const { accountName } = account;
    const accountReader = await bankCrawler.getAccountReader(account);
    
    const now = new Date();

    const cached = await getTransactions({
      date: now,
      bankId,
      accountName,
      username,
    });

    const bankTransactions = await accountReader.getBankTransactions();
    const newTransactions = reconcile({
      cachedTransactions: cached.transactions,
      bankTransactions,
      startOfMonth: getStartOfMonth(),
    });

    if (newTransactions.length > 0) {
      logger.info(`bankAccountProcessor: New Transactions. Found total of ${newTransactions.length}`);
      await updateTransactions(cached._id, newTransactions);
      const message: TransactionsMessage = {
        username,
        bankId,
        accountName,
        transactions: newTransactions,
      };
      await publish(publisherConfig, message);
    }
  } catch (err) {
    await bankCrawler.screenshot();
    logger.error('An error occurred while processing. ', err);
  }
};

export const processUser = async (username: string, { banks, publisherConfig }: UserConfig): Promise<void> => {
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
      await processBankAccount(username, bankConfig.bankId, account, bankCrawler, publisherConfig);
    }

    logger.info(`Done. Closing bank ${bankConfig.bankId}`);
    await bankCrawler.quit();
  }
};
