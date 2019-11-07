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


const reconcileAccount = (accountName) => {
  const accountPage = new AccountPage();

  while(true) {

  }

  accountPage.getNextTransaction();
}



class AccountPage {

  constructor(driver) {
    this.driver = driver;
  }

  getNextTransaction() {
    return {
      description: "something",
      amount: 199
    }
  }
}