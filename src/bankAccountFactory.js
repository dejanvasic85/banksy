const { cbaCrawler } = require('./cba');

const bankAccountFactory = ({ bankId, credentials }) => {
  switch (bankId) {
    case 'cba': {
      const crawler = cbaCrawler(credentials);
      return crawler;
    }
    case 'bom': {
      // Todo - create BOM crawler and account reader
      return null;
    }

    default: {
      throw new Error(`The bank ${type} is not [supported]`);
    }
  }
};

module.exports = {
  bankAccountFactory
};