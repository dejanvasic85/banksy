import { Schema, model, } from 'mongoose';

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

const UserTransactions = model('UserTransactions', userTransactionSchema);

export { UserTransactions };
