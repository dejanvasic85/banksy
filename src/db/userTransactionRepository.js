const UserTransactions = require('./userTransactions');
const dateFormat = require('dateformat');
const logger = require('../logger');

const clean = str => str.trim().replace(' ', '').toLowerCase();

const createKey = (date, bankId, accountName, user) => {
  const dateStr = dateFormat(date, 'yyyymmdd');
  return `${dateStr}-${clean(bankId)}-${clean(accountName)}-${clean(user)}`;
}

const getTransactions = async ({ date, bankId, accountName, user }) => {
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
    transactions: []
  };

  return await UserTransactions.create(newData);
};

module.exports = {
  createKey,
  getTransactions
};