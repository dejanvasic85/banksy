import { createUserTransactions } from './userTransactions';
import logger from '../logger';
import { BankTransaction, UserTransactionsModel } from '../types';
import * as moment from 'moment';

const clean = str =>
  str
    .trim()
    .replace(' ', '')
    .toLowerCase();

export const createKey = (date: Date, bankId: string, accountName: string, username: string) => {
  // Monthly cache
  const dateStr = moment(date).format('YYYYMM');
  return `${dateStr}-${clean(bankId)}-${clean(accountName)}-${clean(username)}`;
};

export const getTransactions = async ({ date, bankId, accountName, username }): Promise<UserTransactionsModel> => {
  const key = createKey(date, bankId, accountName, username);

  logger.info(`userTransactionRepository. Fetching transactions for ${key}`);
  const UserTransactions = await createUserTransactions();
  const todaysTransactions = await UserTransactions.findById(key);

  if (todaysTransactions) {
    return todaysTransactions;
  }

  const newData = {
    _id: key,
    transactions: [],
  };

  return await UserTransactions.create(newData);
};

export const updateTransactions = async (id: string, txns: BankTransaction[]): Promise<void> => {
  const UserTransactions = await createUserTransactions();
  await UserTransactions.findByIdAndUpdate(id, {
    $push: {
      transactions: {
        $each: txns,
      },
    },
  });
};
