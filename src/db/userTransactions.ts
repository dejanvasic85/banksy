import { Schema, Connection } from 'mongoose';
import { UserTransactionsModel } from '../types';
import { connect } from './connect';

const userTransactionSchema = new Schema({
  _id: String,
  transactions: [
    {
      amount: Number,
      date: String,
      description: String,
    },
  ],
});

export const createUserTransactions = async () => {
  const conn = await connect();
  return conn.model<UserTransactionsModel>('UserTransactions', userTransactionSchema);
};
