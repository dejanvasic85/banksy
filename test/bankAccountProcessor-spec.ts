import { expect } from 'chai';
import { stub } from 'sinon';

import * as bankAccountProcessor from '../src/bankAccountProcessor';
import * as bankAccountFactory from '../src/bankAccountFactory';

describe('bankAccountProcessor', () => {
  describe('processUser', () => {
    let processBankAccountStub: any;
    let bankAccountFactoryStub: any;
    let bankCrawlerStub: any;

    before(() => {
      processBankAccountStub = stub(bankAccountProcessor, 'processBankAccount');
      bankAccountFactoryStub = stub(bankAccountFactory, 'bankAccountFactory');
      bankCrawlerStub = {
        login: stub(),
        quit: stub()
      };

      bankAccountFactoryStub.resolves(bankCrawlerStub);
    });

    beforeEach(() => {
      processBankAccountStub.resetHistory();
      bankAccountFactoryStub.resetHistory();
    });

    after(() => {
      processBankAccountStub.restore();
      bankAccountFactoryStub.restore();
    });

    describe('when the crawler exists for the bank', () => {
      it('creates crawler and calls processBankAccount for each account', async () => {
        // arrange
        const userConfig: any = {
          banks: [
            {
              bankId: 'bank',
              credentials: '123',
              accounts: [
                { accountName: 'savings', active: true },
                { accountName: 'creditcard', active: false },
              ],
            },
          ],
          publisherConfig: { type: 'sns', address: 'an-address' },
        };

        // Act
        await bankAccountProcessor.processUser(`user-123`, userConfig);

        expect(processBankAccountStub.getCalls()).to.have.lengthOf(1);
      });
    });
  });
});
