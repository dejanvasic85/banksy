import { expect } from 'chai';

import { config } from '../src/config';

import { reconcile } from '../src/reconciler';

describe('reconcile', () => {
  describe('when cache and new transactions are empty', () => {
    it('should return empty array', () => {
      const { newTxns, matchingTxns, duplicateTxns } = reconcile({
        cachedTransactions: [],
        bankTransactions: [],
      });

      expect(newTxns).to.have.lengthOf(0);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(duplicateTxns).to.have.lengthOf(0);
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

      const { newTxns, matchingTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.eql([
        {
          amount: 350,
          description: 'mcdonalds',
          date: '2020-03-14T13:00:00.000Z',
        },
      ]);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(duplicateTxns).to.have.lengthOf(0);
    });
  });

  describe('when the description is same but different casing', () => {
    it('should return duplicate transaction', () => {
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

      const { matchingTxns, newTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.have.lengthOf(0);
      expect(duplicateTxns).to.have.lengthOf(0);
      expect(matchingTxns).to.eql([
        {
          amount: 300,
          description: 'McDonalds',
          date: '2020-03-14T13:00:00.000Z',
        },
      ]);
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

      const { newTxns, matchingTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.eql([
        {
          amount: 300,
          description: 'target',
          date: '2020-03-14T13:00:00.000Z',
        },
      ]);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(duplicateTxns).to.have.lengthOf(0);
    });
  });

  describe('when duplicate txns are compared because of date range (config = 5)', () => {
    // Usually cached date in the database has the pending transaction
    // And the transaction found in the bank's page has different date (other details remain the same)

    it('should have daysToMatchDuplicateTxns config set to 5 days', () => {
      expect(config.daysToMatchDuplicateTxns).to.equal(5);
    });

    it('should return duplicate transactions when bank date is later and within range', () => {
      const cachedDate = '2020-03-14T13:00:00.000Z';
      const bankTxnDate = '2020-03-18T00:00:00+11:00';

      const txn: any = {
        amount: 300,
        description: 'mcdonalds',
      };

      const cachedTransactions = [{ ...txn, date: cachedDate }];
      const bankTransactions = [{ ...txn, date: bankTxnDate }];

      const { newTxns, matchingTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.have.lengthOf(0);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(duplicateTxns).to.eql([
        {
          amount: 300,
          description: 'mcdonalds',
          date: bankTxnDate,
        },
      ]);
    });

    it('should return duplicate transactions when bank date is later and within range and first 10 chars match', () => {
      const cachedDate = '2020-03-14T13:00:00.000Z';
      const bankTxnDate = '2020-03-18T00:00:00+11:00';

      const cachedTransactions = [{ date: cachedDate, amount: 200, description: 'Dodo Power & Gas Melbourne AU' }];
      const bankTransactions = [{ date: bankTxnDate, amount: 200, description: 'Dodo Power and Gas Melbourne Au' }];

      const { newTxns, matchingTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(newTxns).to.have.lengthOf(0);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(duplicateTxns).to.eql([
        {
          amount: 200,
          description: 'Dodo Power and Gas Melbourne Au',
          date: bankTxnDate,
        },
      ]);
    });

    it('should return new transactions when bank date is older and within range', () => {
      const cachedDate = '2020-03-14T13:00:00.000Z';
      const bankTxnDate = '2020-03-13T00:00:00+11:00';

      const txn: any = {
        amount: 300,
        description: 'mcdonalds',
      };

      const cachedTransactions = [{ ...txn, date: cachedDate }];
      const bankTransactions = [{ ...txn, date: bankTxnDate }];

      const { newTxns, matchingTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(duplicateTxns).to.have.lengthOf(0);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(newTxns).to.eql([
        {
          amount: 300,
          description: 'mcdonalds',
          date: bankTxnDate,
        },
      ]);
    });

    it('should return new transactions when bank date newer and just out of range', () => {
      const cachedDate = '2020-03-14T13:00:00.000Z';
      const bankTxnDate = '2020-03-21T00:00:00+11:00';

      const txn: any = {
        amount: 300,
        description: 'mcdonalds',
      };

      const cachedTransactions = [{ ...txn, date: cachedDate }];
      const bankTransactions = [{ ...txn, date: bankTxnDate }];

      const { newTxns, matchingTxns, duplicateTxns } = reconcile({ cachedTransactions, bankTransactions });

      expect(duplicateTxns).to.have.lengthOf(0);
      expect(matchingTxns).to.have.lengthOf(0);
      expect(newTxns).to.eql([
        {
          amount: 300,
          description: 'mcdonalds',
          date: bankTxnDate,
        },
      ]);
    });
  });
});
