const { users } = require('./config');
const { getSecret } = require('./secretFetcher');
const { processUser } = require('./bankAccountProcessor');
const logger = require('./logger');
const { connect } = require('./db');
const { getTransactions } = require('./db/userTransactionRepository');

(async function () {
  try {
    logger.info("Service launching. Connecting to mongo");
    const result = await connect();
    logger.info(result);

    const today = new Date();
    
    logger.info("fetcing...")
    const data = await getTransactions({ date: today, bankId: 'cba', accountName: 'smart-access', user: 'dejan '});
    console.log('and the result is', data._id);

    // const txn = { description: 'cool dude', amount: 100 };
    // const newUserTransactions = new UserTransactions({ _id: 'dejan-cba-2019010101', date: new Date(), transactions: [txn ]});
    // await newUserTransactions.save();

    // for (const userData of users) {
    //   const { key } = userData;
    //   const userConfig = await getSecret(key);
    //   await processUser(JSON.parse(userConfig));
    // }

  } catch (err) {
    logger.error(err);
    throw err;
  }

})();
