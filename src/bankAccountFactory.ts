import { cbaCrawler } from './cba';
import { BankAccountCrawler } from './types';

export const bankAccountFactory = ({ bankId, credentials }) : BankAccountCrawler  => {
  switch (bankId) {
    case 'cba': {
      return cbaCrawler(credentials);
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