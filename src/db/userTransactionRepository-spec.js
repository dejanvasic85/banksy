const repository = require('./userTransactionRepository');
const { expect } = require('chai');
const dateFormat = require('dateformat');

describe('repository', () => {
  it('should create a new key', () => {
    expect(repository.createKey(
      Date.parse('2019-11-21'),
      'cba',
      'smart access',
      'Dejan Vasic'
    )).to.equal('20191121-cba-smartaccess-dejanvasic');
  });
});