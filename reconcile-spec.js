const { reconcile, accountIterator } = require('./reconcile');
const { expect } = require('chai');
const sinon = require('sinon');

describe('reconcile', () => {

  it('returns new transactions', () => {
    const ynabTxns = [
      { description: 'spotify', amount: 100, date: '2019/11/08' },
      { description: 'airbnb', amount: 150, date: '2019/11/08' }
    ];

    const bankAccount = {
      getNextTransaction: sinon.stub()
        .onFirstCall().returns({ description: 'youtube', amount: 200, date: '2019/11/08' })
        .onSecondCall().returns({ description: 'breakfast', amount: 20, date: '2019/11/08' })
        .onThirdCall().returns({ description: 'airbnb', amount: 150, date: '2019/11/08' })
    };

    const data = [];
    for (const t of accountIterator(ynabTxns, bankAccount)) {
      data.push(t);
    }
    
    expect(data).to.eql([
      { description: 'youtube', amount: 200, date: '2019/11/08' },
      { description: 'breakfast', amount: 20, date: '2019/11/08' }
    ]);
  });
}); 