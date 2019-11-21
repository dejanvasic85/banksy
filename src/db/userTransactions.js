const { Schema, model } = require('mongoose');

const userTransactionSchema = new Schema({
  _id: String,
  date: String,
  transactions: [
    {
      description: String,
      amount: Number
    }
  ]
});

module.exports = model('UserTransactions', userTransactionSchema);