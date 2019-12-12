import { UserConfig } from './types';
import * as BankAccountProcessor from './bankAccountProcessor';
import * as BankAccountFactory from './bankAccountFactory';

import { stub } from 'sinon';

describe('bankAccountProcessor', () => {
  let bankAccountFactorySpy = stub();

  beforeEach(() => {
    //BankAccountFactory.bankAccountFactory = bankAccountFactorySpy;
  });

  

  describe('processUser', () => {
    describe('when no active accounts exists', () => {
      it('bankAccountFactory should not be called', async () => {
        const userConfig : UserConfig = {
          user: 'test',
          publisherConfig: null,
          banks: [{
            bankId: 'bank123',
            credentials: "",
            accounts: [{
              active: false,
              accountName: 'boom-boom'
            }]
          }]
        };
        
        // await BankAccountProcessor.processUser(userConfig);


      })

    })

  });

});