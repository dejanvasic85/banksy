const { Capabilities, By, Builder, Key, Until } = require('selenium-webdriver');
const log = require('./logger');
const accounts = require('./config/accounts.json');
const accountStrategies = require('./strategies');

const pause = async (pauseMs) => {
  return new Promise((res) => { 
    setTimeout(() => { res(true); }, pauseMs);
  });
}

// (async function() {
//   let driver;
//   const capabilities = Capabilities.chrome();

//   try {
//     const scraping = accountStrategies.map(acc => );

//   } catch (err) {
//     log('UNEXPECTED ERROR', err);
//   } finally {
//     if (driver) {
//       log('Chrome quit');
//       driver.quit();
//     }
//   }
// })();


const ynab = (ynabKey) => {
  return {
    getTransactions: () => {
      return [{
        date: '2019/11/06',
        memo: 'Myki',
        payee: 'Myki',
        amount: 50
      }, {
        date: '2019/11/06',
        memo: 'Foxtel',
        payee: 'Foxtel',
        amount: 39
      }]
    },
    createTransaction = (txn) => {
      // Todo 
    }
  };
}

const reconcileAccount = ({ynabKey}) => {
  const ynabAccount = ynab(ynabKey);
  ynabAccount.getTransactions();

  const accountPage = new AccountPage();
  accountPage.getNextTransaction();
 
}

class AccountPage {

  constructor(driver) {
    this.driver = driver;
  }

  getNextTransaction() {
    return {
      date: '',
      description: "something",
      amount: 199
    }
  }
}