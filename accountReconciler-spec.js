const { accountReconciler } = require('./accountReconciler');
const { expect } = require('chai');
const sinon = require('sinon');

describe('accountReconciler', () => {

  it('should return new transactions not found in ynab', () => {
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
    for (const t of accountReconciler(ynabTxns, bankAccount)) {
      data.push(t);
    }

    expect(data).to.eql([
      { description: 'youtube', amount: 200, date: '2019/11/08' },
      { description: 'breakfast', amount: 20, date: '2019/11/08' }
    ]);
  });

  it('should return nothing empty array if first transaction is in ynab', () => {
    const ynabTxns = [
      { description: 'spotify', amount: 200, date: '2019/11/08' }
    ];

    const bankAccount = {
      getNextTransaction: sinon.stub()
        .onFirstCall().returns({ description: 'spotify', amount: 200, date: '2019/11/08' })
        .onSecondCall().returns({ description: 'breakfast', amount: 20, date: '2019/11/08' })
    };

    const data = [];
    for (const t of accountReconciler(ynabTxns, bankAccount)) {
      data.push(t);
    }

    expect(data).to.eql([]);
  });

  it('should return nothing when bank account has no transactions', () => {
    const ynabTxns = [
      { description: 'spotify', amount: 200, date: '2019/11/08' }
    ];

    const bankAccount = {
      getNextTransaction: sinon.stub().returns(null)
    };

    const data = [];
    for (const t of accountReconciler(ynabTxns, bankAccount)) {
      data.push(t);
    }

    expect(data).to.eql([]);
  });

  it('should return all account transactions when ynab is empty', () => {
    const bankAccount = {
      getNextTransaction: sinon.stub()
        .onFirstCall().returns({ description: 'spotify', amount: 200, date: '2019/11/08' })
        .onSecondCall().returns({ description: 'breakfast', amount: 20, date: '2019/11/08' })
    };

    const data = [];
    for (const t of accountReconciler([], bankAccount)) {
      data.push(t);
    }

    expect(data).to.have.lengthOf(2);
    expect(data).to.eql([
      { description: 'spotify', amount: 200, date: '2019/11/08' },
      { description: 'breakfast', amount: 20, date: '2019/11/08' }
    ])
  });
}); 