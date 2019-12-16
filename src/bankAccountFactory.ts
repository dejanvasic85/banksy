import { cbaCrawler } from './banks/cba';
import { bomCrawler } from './banks/bom';
import { westpacCrawler } from './banks/westpac';
import { BankAccountCrawler } from './types';

export const bankAccountFactory = async ({ bankId, credentials }) : Promise<BankAccountCrawler>  => {
  switch (bankId) {
    case 'cba': {
      return await cbaCrawler(credentials);
    }
    case 'bom': {
      return await bomCrawler(credentials);
    }
    case 'westpac': {
      return await westpacCrawler(credentials);
    }

    default: {
      throw new Error(`The bank ${bankId} is not supported`);
    }
  }
};