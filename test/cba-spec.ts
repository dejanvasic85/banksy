import { expect } from 'chai';
import { cbaCredentialReader } from '../src/banks/cba';
import { encrypt } from '../src/encrypt';

describe('cba', () => {
  describe('cbaCredentialsReader', () => {
    it('returns member number and password', () => {
      const { memberNumber, password } = cbaCredentialReader(encrypt('randomuser|randompassword'));
      expect(memberNumber).to.equal('randomuser');
      expect(password).to.equal('randompassword');
    });
  });
});
