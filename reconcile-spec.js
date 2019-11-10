const { reconcile } = require('./reconcile');
const { expect } = require('chai');
const sinon = require('sinon');

describe('reconcile', () => {

  it('returns new transactions', () => {
    const ynabTxns = sinon.fake.returns([{
      description: 'spotify', amount: 100, date: '2019/11/08',
      description: 'airbnb', amount: 150, date: '2019/11/08'
    }]);
    
    const accountTxns = sinon.fake.returns({
      description: 'youtube', amount: 200, date: '2019/11/09',
      description: 'breakfast', amount: 20, date: '2019/11/08',
      description: 'spotify', amount: 100, date: '2019/11/08'
    });

    const ynabAccount = {
      getTransactions: ynabTxns
    };

    const bankAccount = {
      getNextTransaction: accountTxns
    };

    const result = reconcile({ ynabAccount, bankAccount});
    expect(result).to.eql([{
      description: 'youtube', amount: 200, date: '2019/11/08',
      description: 'breakfast', amount: 20, date: '2019/11/08'
    }]);
  });

}); 