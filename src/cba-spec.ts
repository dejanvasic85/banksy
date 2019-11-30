import { expect } from 'chai';
import { cbaCredentialReader } from './cba';
import { encrypt } from './encrypt';

describe('cba', () => {
  describe('cbaCredentialsReader', () => {
    const { memberNumber, password } = cbaCredentialReader(encrypt('randomuser|randompassword'));
    expect(memberNumber).to.equal('randomuser');
    expect(password).to.equal('randompassword');
  });
});
