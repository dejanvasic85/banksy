import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { cbaCredentialReader } from '../src/banks/cba';
import { encrypt } from '../src/encrypt';
import { config } from '../src/config';

describe('cba', () => {
  describe('cbaCredentialsReader', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('returns member number and password', () => {
      sandbox.stub(config, 'encryptionKey').value('doesnotmatter');
      const { memberNumber, password } = cbaCredentialReader(encrypt('randomuser|randompassword'));
      expect(memberNumber).to.equal('randomuser');
      expect(password).to.equal('randompassword');
    });
  });
});
