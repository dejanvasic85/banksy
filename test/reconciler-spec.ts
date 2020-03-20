import { reconcile } from '../src/reconciler';
import { expect } from 'chai';

describe('reconcile', () => {
  const txnDate = '2020-03-14T13:00:00.000Z';
  const cachedDate = '2020-03-18T00:00:00+11:00';

  describe('when cache and new transactions are empty', () => {
    it('should return empty array', () => {
      const { duplicates, newTransactions } = reconcile({
        cachedTransactions: [],
        bankTransactions: [],
      });

      expect(newTransactions).to.have.lengthOf(0);
      expect(duplicates).to.have.lengthOf(0);
    });
  });

  describe('when the amounts are different', () => {
    it('should return new transaction', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: txnDate,
      };

      const cachedTransactions = [
        {
          ...txn,
          date: cachedDate,
        },
      ];

      const bankTransactions = [
        {
          ...txn,
          amount: 350,
        },
      ];

      const { newTransactions, duplicates } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTransactions).to.eql([
        {
          amount: 350,
          description: 'mcdonalds',
          date: txnDate,
        },
      ]);

      expect(duplicates).to.have.lengthOf(0);
    });
  });

  describe('when the description is same but different casing', () => {
    it('should return duplicate transaction', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: txnDate,
      };

      const cachedTransactions = [txn];

      const bankTransactions = [
        {
          ...txn,
          description: 'McDonalds',
        },
      ];

      const { duplicates, newTransactions } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTransactions).to.have.lengthOf(0);
      expect(duplicates).to.eql([
        {
          amount: 300,
          description: 'McDonalds',
          date: txnDate,
        },
      ]);
    });
  });

  describe('when the description contains pending', () => {
    it('should return duplicate transaction', () => {
      const cachedTransactions = [
        {
          amount: 300,
          description: 'McDonalds',
          date: cachedDate,
        },
        {
          amount: 200,
          description: 'Kfc',
          date: cachedDate,
        },
      ];

      const bankTransactions = [
        {
          amount: 300,
          description: 'pending - McDonalds',
          date: txnDate,
        },
        {
          amount: 200,
          description: 'PENDING  - KFC',
          date: txnDate,
        },
      ];

      const { duplicates, newTransactions } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTransactions).to.have.lengthOf(0);
      expect(duplicates).to.eql([
        {
          amount: 300,
          description: 'McDonalds',
          date: txnDate,
        },
        {
          amount: 200,
          description: 'KFC',
          date: txnDate,
        },
      ]);
    });
  });

  describe('when the description is different', () => {
    it('should return the new transaction', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: txnDate,
      };

      const cachedTransactions = [txn];

      const bankTransactions = [
        {
          ...txn,
          description: 'target',
        },
      ];

      const { newTransactions, duplicates } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTransactions).to.eql([
        {
          amount: 300,
          description: 'target',
          date: txnDate,
        },
      ]);

      expect(duplicates).to.have.lengthOf(0);
    });
  });
});
