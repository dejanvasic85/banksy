const { users } = require('./config');
const { getSecret } = require('./secretFetcher');
const { processUser } = require('./bankAccountProcessor');
const logger = require('./logger');
const { connect } = require('./db');
const { getTransactions, updateTransactions } = require('./db/userTransactionRepository');

(async function () {
  try {
    logger.info("Service launching. Connecting to mongo");
    const result = await connect();
    logger.info(result);

    for (const userData of users) {
      const { key } = userData;
      const userConfig = await getSecret(key);
      await processUser(JSON.parse(userConfig));
    }

  } catch (err) {
    logger.error(err);
    throw err;
  }

})();
