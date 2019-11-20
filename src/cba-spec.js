const { expect } = require('chai');

const {
  cbaCredentialReader
} = require('./cba');

const {
  encrypt
} = require('./encrypt');

describe('cba', () => {

  describe('cbaCredentialsReader', () => {
    const { memberNumber, password } = cbaCredentialReader(encrypt('randomuser|randompassword'));
    expect(memberNumber).to.equal('randomuser');
    expect(password).to.equal('randompassword');
  });

});