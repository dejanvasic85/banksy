import { expect } from 'chai';
import { stub } from 'sinon';

import * as bankAccountProcessor from '../src/bankAccountProcessor';
import * as bankAccountFactory from '../src/bankAccountFactory';
import * as userRepository from '../src/db/userTransactionRepository';
import * as reconciler from '../src/reconciler';
import * as startOfMonth from '../src/startOfMonth';
import * as publisher from '../src/publisher';

const baseUserConfig: any = {
  banks: [
    {
      bankId: 'bank',
      credentials: '123',
      accounts: [
        { accountName: 'savings', active: true },
        { accountName: 'creditcard', active: false },
        { accountName: 'cheque', active: true },
      ],
    },
  ],
  publisherConfig: { type: 'sns', address: 'an-address' },
};

describe('bankAccountProcessor', () => {
  let bankAccountFactoryStub: any;
  let bankCrawlerStub: any;
  let getTransactionsStub: any;
  let updateTransactionsStub: any;
  let reconcileStub: any;
  let startOfMonthStub: any;
  let getBankTransactionsStub: any;
  let publishToSnsStub: any;

  before(() => {
    bankCrawlerStub = {
      login: stub(),
      quit: stub(),
      screenshot: stub(),
      getAccountReader: stub(),
    };

    getBankTransactionsStub = stub();

    bankCrawlerStub.getAccountReader.resolves({
      getBankTransactions: getBankTransactionsStub,
    });

    bankAccountFactoryStub = stub(bankAccountFactory, 'bankAccountFactory');
    bankAccountFactoryStub.resolves(bankCrawlerStub);

    getTransactionsStub = stub(userRepository, 'getTransactions');
    updateTransactionsStub = stub(userRepository, 'updateTransactions');
    reconcileStub = stub(reconciler, 'reconcile');
    startOfMonthStub = stub(startOfMonth, 'getStartOfMonth');
    publishToSnsStub = stub(publisher, 'publishToSns')
  });

  beforeEach(() => {
    bankCrawlerStub.login.resetHistory();
    bankAccountFactoryStub.resetHistory();
    getTransactionsStub.resetHistory();
    updateTransactionsStub.resetHistory();
    reconcileStub.resetHistory();
    startOfMonthStub.resetHistory();
    getBankTransactionsStub.resetHistory();
    publishToSnsStub.resetHistory();
  });

  after(() => {
    bankAccountFactoryStub.restore();
    getTransactionsStub.restore();
    updateTransactionsStub.restore();
    reconcileStub.restore();
    startOfMonthStub.restore();
    publishToSnsStub.restore();
  });

  describe('processUser', () => {
    let processBankAccountStub: any;

    before(() => {
      processBankAccountStub = stub(bankAccountProcessor, 'processBankAccount');
    });

    beforeEach(() => {
      processBankAccountStub.resetHistory();
    });

    after(() => {
      processBankAccountStub.restore();
    });

    describe('when the crawler exists for the bank', () => {
      it('creates crawler and calls processBankAccount for each account', async () => {
        await bankAccountProcessor.processUser(`user-123`, baseUserConfig);

        expect(processBankAccountStub.getCalls()).to.have.lengthOf(2);
        expect(bankCrawlerStub.login.getCalls()).to.have.lengthOf(1);
        expect(bankCrawlerStub.quit.getCalls()).to.have.lengthOf(1);
      });
    });

    describe('when the crawler cannot be created', () => {
      it('processBankAccount should not get called', async () => {
        bankAccountFactoryStub.resolves(null);

        await bankAccountProcessor.processUser(`user-123`, baseUserConfig);

        expect(processBankAccountStub.called).to.equal(false);
      });
    });
  });

  describe('processBankAccount', () => {
    const username = 'user123';
    const bankId = 'bank321';
    const account: any = {
      accountName: 'bankAccount',
    };
    const publisherConfig: any = {};

    describe('when reconcile returns no results', () => {
      it('should not publish the message', async () => {
        getBankTransactionsStub.resolves([]);
        getTransactionsStub.resolves([]);
        reconcileStub.returns([]);

        await bankAccountProcessor.processBankAccount(username, bankId, account, bankCrawlerStub, publisherConfig);

        expect(getTransactionsStub.called).to.equal(true);
        expect(getBankTransactionsStub.called).to.equal(true);
        expect(updateTransactionsStub.called).to.equal(false);
        expect(publishToSnsStub.called).to.equal(false);
      });
    });
  });
});
