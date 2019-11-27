import { UserTransactions } from './userTransactions';
import * as dateFormat from 'dateformat';
import * as logger from '../logger';

const clean = str =>
  str
    .trim()
    .replace(' ', '')
    .toLowerCase();

export const createKey = (date: Date, bankId: string, accountName: string, user: string) => {
  const dateStr = dateFormat(date, 'yyyymmdd');
  return `${dateStr}-${clean(bankId)}-${clean(accountName)}-${clean(user)}`;
};

// Example:
// const data = await getTransactions({ date: today, bankId: 'cba', accountName: 'smart-access', user: 'dejan '})
export const getTransactions = async ({ date, bankId, accountName, user }) => {
  const key = createKey(date, bankId, accountName, user);

  logger.info(`Fetching transactions for ${key}`);
  const todaysTransactions = await UserTransactions.findById(key);
  if (todaysTransactions) {
    logger.info('Found');
    return todaysTransactions;
  }

  // Create default document for today with empty txns
  logger.info('Not found. Creating.');
  var today = dateFormat((new Date(), 'yyyymmdd'));
  const newData = {
    _id: key,
    date: today,
    transactions: [],
  };

  return await UserTransactions.create(newData);
};

// Example:
// const txn = { description: 'cool dude', amount: -100 };
// const data = await updateTransactions(data, [txn]);
export const updateTransactions = async ({ _id }, txns) => {
  await UserTransactions.findByIdAndUpdate(_id, {
    $push: {
      transactions: {
        $each: txns,
      },
    },
  });
};