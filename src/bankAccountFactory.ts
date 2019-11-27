import { cbaCrawler } from './cba';
import { BankAccountCrawler } from './types';

export const bankAccountFactory = async ({ bankId, credentials }) : Promise<BankAccountCrawler>  => {
  switch (bankId) {
    case 'cba': {
      return await cbaCrawler(credentials);
    }
    case 'bom': {
      // Todo - create BOM crawler and account reader
      return null;
    }

    default: {
      throw new Error(`The bank ${bankId} is not supported`);
    }
  }
};