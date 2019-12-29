import { reconcile } from '../src/reconciler';
import { expect } from 'chai';
import * as moment from 'moment';

describe('reconcile', () => {
  it('returns empty array when both data sets are empty', () => {
    const result = reconcile({
      startOfMonth: null,
      cachedTransactions: [],
      bankTransactions: [],
    });

    expect(result).to.eql([]);
  });

  it('returns the new bank transactions', () => {
    const december = moment('2019-12-28T00:00:00+11:00');
    const startOfMonth = december.startOf('month');

    const result = reconcile({
      startOfMonth,
      cachedTransactions: [
        {
          amount: 100,
          description: 'mcdonalds',
          date: '2019-12-28T00:00:00+11:00',
        },
        {
          amount: 200,
          description: 'kmart',
          date: '2019-12-28T00:00:00+11:00',
        },
        {
          amount: 300,
          description: 'target',
          date: '2019-12-28T00:00:00+11:00',
        },
      ],
      bankTransactions: [
        {
          amount: 300, // different amount
          description: 'mcdonalds',
          date: '2019-12-28T00:00:00+11:00',
        },
        {
          amount: 100,
          description: 'xbox', // different description
          date: '2019-12-28T00:00:00+11:00',
        },
        {
          amount: 100,
          description: 'mcdonalds',
          date: '2019-12-27T00:00:00+11:00', // different date
        },
        {
          amount: 100,
          description: 'mcdonalds',
          date: '2019-11-29T00:00:00+11:00', // ignore older date (last month)
        },
        {
          // everything is the same
          amount: 300,
          description: 'target',
          date: '2019-12-28T00:00:00+11:00',
        },
      ],
    });

    expect(result).to.deep.equal([
      {
        amount: 300,
        description: 'mcdonalds',
        date: '2019-12-28T00:00:00+11:00',
      },
      {
        amount: 100,
        description: 'xbox',
        date: '2019-12-28T00:00:00+11:00',
      },
      {
        amount: 100,
        description: 'mcdonalds',
        date: '2019-12-27T00:00:00+11:00',
      },
    ]);
  });
});
