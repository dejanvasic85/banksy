require('chromedriver');
const webdriver = require('selenium-webdriver');
const { decrypt } = require('./encrypt');

const cbaCredentialReader = (key) => {
  const [memberNumber, password] = decrypt(key).split('|');
  return {
    memberNumber,
    password
  };
};

const cbaAccountReader = () => {
  const getNextTransaction = async () => {
    // Todo - use selenium to get the full details of the transaction
  }

  const openAccount = async () => {
    // Todo - use selenium to open the account page
  }

  return {
    getNextTransaction
  };
};

const cbaCrawler = (credentials) => {
  const { memberNumber, password } = cbaCredentialReader(credentials);

  return {
    login: async () => {
      // Todo - use selenium to login
    },
    getAccountReader: async (accountName) => {
      // Todo - use selenium to fetch the account page
      return cbaAccountReader(accountName);
    },
    quit: async () => {
      // Todo - use selenium to close the browser;
    }
  };
};

module.exports = {
  cbaCredentialReader,
  cbaAccountReader,
  cbaCrawler
};