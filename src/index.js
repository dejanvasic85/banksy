const { users } = require('./config');
const { getSecret } = require('./secretFetcher');
const { processUser } = require('./bankAccountProcessor');
const logger = require('./logger');
const { connect } = require('./db');

const start = async () => {
  try {
    logger.info("Service launching. Connecting to mongo");
    const result = await connect();
    logger.info(result);
    for (const userData of users) {
      const { key } = userData;
      const userConfig = await getSecret(key);
      if (userConfig) {
        await processUser(JSON.parse(userConfig));
      }      
    }
    process.exit(0);
  }
  catch (err) {
    logger.error("WHAT THE", err);
    process.exit(1);
  }
};

start();