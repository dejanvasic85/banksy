import { Pool } from 'pg';
import { BankTransaction } from './types';
import { config } from './config';

// This will automatically use environment variables
const pgClient = new Pool({
  ...config.pg,
});

export const getTransactions = async (bankId: string, ): Promise<BankTransaction[]> => {
  const { rows } = await pgClient.query('select * from "bankTransactions"');
  return rows as BankTransaction[];
};

export const createTransactions = async (txns: BankTransaction[]) => {
  // Todo
};
