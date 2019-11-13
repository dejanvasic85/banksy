const { cbaCrawler, cbaCredentialReader } = require('./cba');

const bankAccountFactory = async ({ type, credentialsKey }) => {
  switch (type) {
    case 'cba': {
      const credentials = cbaCredentialReader(credentialsKey);
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
