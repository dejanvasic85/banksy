import { Pool } from 'pg';
import { BankTransaction } from './types';
import { config } from './config';
import logger from './logger';

// This will automatically use environment variables
const pgClient = new Pool({
  ...config.pg,
});

const userBankQuery = (bankId: string, accountName: string, username: string) => ({
  name: 'fetch-user-bank',
  text: `SELECT * FROM "userBanks" WHERE "bankId" = $1 AND "accountName" = $2 AND "username" = $3;`,
  values: [bankId, accountName, username],
});

const userBankInsert = (bankId: string, accountName: string, username: string) => ({
  name: 'insert-user-bank',
  text: `INSERT INTO "userBanks" ("bankId", "accountName", "username") VALUES($1, $2, $3);`,
  values: [bankId, accountName, username],
});

const userBankTransactionsQuery = (userBankId: number) => ({
  name: 'fetch-user-bank-transactions',
  text: `SELECT * FROM "userBankTransactions" WHERE "userbankid" = $1 AND "date" > current_date - interval '6' day;`,
  values: [userBankId],
});

const userBankTransactionInsert = (userBankId: number, txn: BankTransaction) => ({
  name: 'insert-user-bank-transaction',
  text:
    'INSERT INTO "userBankTransactions" ("userbankid", "amount", "description", "date") VALUES ($1, $2, $3, $4) RETURNING *;',
  values: [userBankId, txn.amount, txn.description, txn.date],
});

export const getTransactions = async (
  bankId: string,
  accountName: string,
  username: string,
): Promise<BankTransaction[]> => {
  const userBanksResult = await pgClient.query(userBankQuery(bankId, accountName, username));

  if (userBanksResult.rowCount === 0) {
    await pgClient.query(userBankInsert(bankId, accountName, username));
    return [];
  }
  
  const [{ id }] = userBanksResult.rows;
  const { rows } = await pgClient.query(userBankTransactionsQuery(id));
  
  logger.info(`Found ${rows.length} number of transactions in cache`);

  return rows as BankTransaction[];
};

export const createTransactions = async (
  bankId: string,
  accountName: string,
  username: string,
  txns: BankTransaction[],
) => {
  const userBanksResult = await pgClient.query(userBankQuery(bankId, accountName, username));

  if (userBanksResult.rowCount === 0) {
    throw new Error('userBanksResult has no errors. This should not happen');
  }

  const [{ id }] = userBanksResult.rows;

  for (const t of txns) {
    await pgClient.query(userBankTransactionInsert(id, t));
  }
};
