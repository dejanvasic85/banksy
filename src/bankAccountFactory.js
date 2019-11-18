const { cbaCrawler, cbaCredentialReader } = require('./cba');

const bankAccountFactory = async ({ bankId, credentials }) => {
  switch (bankId) {
    case 'cba': {
      console.log('IS IT?? ', cbaCredentialReader);
      const credentials = cbaCredentialReader(credentials);
      const crawler = cbaCrawler(credentials);
      await crawler.login();
      return await crawler.getAccountReader();
    }
    case 'bom': {
      // Todo - create BOM crawler and account reader
    }

    default: {
      throw new Error(`The bank ${type} is not [supported]`);
    }
  }
};

module.exports = {
  bankAccountFactory,
  testOnly: () => {
    return cbaCredentialReader('apple juice is the freaking business');
  }
};