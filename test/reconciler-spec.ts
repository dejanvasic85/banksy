import { reconcile } from '../src/reconciler';
import { expect } from 'chai';
import * as moment from 'moment';

describe.only('reconcile', () => {
  const txnDate = '2019-12-28T00:00:00+11:00';
  const txnMomentDate = moment(txnDate);
  const txnStartOfMonth = txnMomentDate.startOf('month');

  describe('when cache and new transactions are empty', () => {
    it('should return empty array', () => {
      const result = reconcile({
        startOfMonth: null,
        cachedTransactions: [],
        bankTransactions: [],
      });

      expect(result).to.have.lengthOf(0);
    });
  });

  describe('when the amounts are different', () => {
    it('should return new transaction', () => {
      const txn = {
        amount: 300,
        description: 'mcdonalds',
        date: txnDate,
      };

      const cachedTransactions = [txn];

      const bankTransactions = [
        {
          ...txn,
          amount: 350,
        },
      ];

      const result = reconcile({ startOfMonth: txnStartOfMonth, cachedTransactions, bankTransactions });

      expect(result).to.eql([
        {
          amount: 350,
          description: 'mcdonalds',
          date: txnDate,
        },
      ]);
    });
  });

  describe('when the description is same but different casing', () => {
    it('should return no new transactions', () => {
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

      const result = reconcile({ startOfMonth: txnStartOfMonth, cachedTransactions, bankTransactions });

      expect(result).to.have.lengthOf(0);
    });
  });

  describe('when the description contains pending and bank txn ', () => {
    it('should return no new transactions', () => {
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

      const result = reconcile({ startOfMonth: txnStartOfMonth, cachedTransactions, bankTransactions });

      expect(result).to.have.lengthOf(0);
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

      const result = reconcile({ startOfMonth: txnStartOfMonth, cachedTransactions, bankTransactions });

      expect(result).to.eql([
        {
          amount: 300,
          description: 'target',
          date: txnDate,
        },
      ]);
    });
  });

  describe('when the date is different', () => {
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
          date: '2019-12-27T00:00:00+11:00',
        },
      ];

      const result = reconcile({ startOfMonth: txnStartOfMonth, cachedTransactions, bankTransactions });

      expect(result).to.eql([
        {
          amount: 300,
          description: 'mcdonalds',
          date: '2019-12-27T00:00:00+11:00',
        },
      ]);
    });
  });
});
