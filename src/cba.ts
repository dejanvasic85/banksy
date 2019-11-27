require('chromedriver');
import { decrypt } from './encrypt';
import { BankAccountReader, BankAccountCrawler, BankTransaction } from './types';

export const cbaCredentialReader = (key: String): any => {
  const [memberNumber, password] = decrypt(key).split('|');
  return {
    memberNumber,
    password
  };
};

export const cbaAccountReader = (accountName: string) : BankAccountReader => {
  return {
    getTodaysTransactions: async () : Promise<[BankTransaction]> => {
      return null;
    },
    openAccount: async() => {
      
    }
  };
};

export const cbaCrawler = (credentials: string) : BankAccountCrawler => {
  const { memberNumber, password } = cbaCredentialReader(credentials);

  return {
    login: async () : Promise<void> => {
      // Todo - use selenium to login
    },
    getAccountReader: async (accountName: string) : Promise<BankAccountReader> => {
      // Todo - use selenium to fetch the account page
      return cbaAccountReader(accountName);
    },
    quit: async () => {
      // Todo - use selenium to close the browser;
    }
  };
};
