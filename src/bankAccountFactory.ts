import { cbaCrawler } from './cba';
import { bomCrawler } from './bom';
import { BankAccountCrawler } from './types';

export const bankAccountFactory = async ({ bankId, credentials }) : Promise<BankAccountCrawler>  => {
  switch (bankId) {
    case 'cba': {
      return await cbaCrawler(credentials);
    }
    case 'bom': {
      return await bomCrawler(credentials);
    }

    default: {
      throw new Error(`The bank ${bankId} is not supported`);
    }
  }
};