import { createKey } from '../src/db/userTransactionRepository';
import { expect } from 'chai';

describe('createKey', () => {
  const someDay = new Date('2019-10-29');
  expect(createKey(someDay, 'bank', 'savings', 'rogan')).to.equal('201910-bank-savings-rogan');
});