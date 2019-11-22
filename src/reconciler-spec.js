const { reconcile } = require('./reconciler');
const { expect } = require('chai');

describe('reconcile', () => {
  it('returns empty array when both data sets are empty', () => {
    const result = reconcile({
      todaysTransactions: [],
      bankTransactions: []
    });

    expect(result).to.eql([]);
  });

  it('returns the new bank transactions', () => {
    const result = reconcile({
      todaysTransactions: [
        { amount: 100, description: 'existing' }
      ],
      bankTransactions: [
        { amount: 100, description: 'new' },
        { amount: 200, description: 'new-again' },
      ]
    });

    expect(result).to.deep.equal([
      { amount: 100, description: 'new' },
      { amount: 200, description: 'new-again' },
    ]);
  });
});