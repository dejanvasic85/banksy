import { expect } from 'chai';

import { reconcile } from '../src/reconciler';

describe('reconcile', () => {
  describe('when cache and new transactions are empty', () => {
    it('should return empty array', () => {
      const { newTxns } = reconcile({
        cachedTransactions: [],
        bankTransactions: [],
      });

      expect(newTxns).to.have.lengthOf(0);
    });
  });

  describe('when the amounts are different', () => {
    it('should return new transaction', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: '2020-03-14T13:00:00.000Z',
      };

      const cachedTransactions = [txn];
      const bankTransactions = [
        {
          ...txn,
          amount: 350,
        },
      ];

      const { newTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.eql([
        {
          amount: 350,
          description: 'mcdonalds',
          date: '2020-03-14T13:00:00.000Z',
        },
      ]);
    });
  });

  describe('when the description is same but different casing', () => {
    it('should return no new transactions', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: '2020-03-14T13:00:00.000Z',
      };

      const cachedTransactions = [txn];
      const bankTransactions = [
        {
          ...txn,
          description: 'McDonalds',
        },
      ];

      const { newTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.have.lengthOf(0);
    });
  });

  describe('when the description is different', () => {
    it('should return new transaction', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: '2020-03-14T13:00:00.000Z',
      };

      const cachedTransactions = [txn];
      const bankTransactions = [
        {
          ...txn,
          description: 'target',
        },
      ];

      const { newTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.eql([
        {
          amount: 300,
          description: 'target',
          date: '2020-03-14T13:00:00.000Z',
        },
      ]);
    });
  });
});
