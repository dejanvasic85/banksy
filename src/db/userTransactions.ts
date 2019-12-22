import { Schema, model } from 'mongoose';

const userTransactionSchema = new Schema({
  _id: String,
  transactions: [
    {
      description: String,
      amount: Number
    }
  ]
});

const UserTransactions = model('UserTransactions', userTransactionSchema);

export { UserTransactions };