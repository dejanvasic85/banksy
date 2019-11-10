const accounts = require('./config/accounts.json');

class YNAB {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getTransactions(howMany) {
    return [{
      date: '2019/11/06',
      memo: 'Myki',
      payee: 'Myki',
      amount: 50
    }, {
      date: '2019/11/06',
      memo: 'Foxtel',
      payee: 'Foxtel',
      amount: 39
    }];
  }

  createTransaction(txn) {

  }
}

class Account {
  getNextTransaction() {
    return {
      date: '2019/11/06',
      description: "something",
      amount: 199
    }
  }
}

const areEqual = (txn1, txn2) => {
  return txn1.date === txn2.date &&
    txn1.amount === txn2.amount &&
    txn1.description === txn2.description;
}

module.exports.getMissingTransactions = ({ ynabTransactions, bankAccount }) => {
  const newTransactions = [];
  const accountTxn = bankAccount.getNextTransaction();
  const t = ynabTransactions.find(ynabTxn => areEqual(ynabTxn, accountTxn));
  
  if (!t) {
    console.log('not here, adding', accountTxn);
    newTransactions.push(accountTxn);
  } 

  return newTransactions;  
}

module.exports.reconcile = ({ ynabAccount, bankAccount }) => {
  const param = {
    ynabTransactions: ynabAccount.getTransactions(),
    bankAccount
  }
  
  return this.getMissingTransactions(param);
};