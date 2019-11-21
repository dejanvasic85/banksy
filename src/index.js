const { users } = require('./config');
const { getSecret } = require('./secretFetcher');
const { processUser } = require('./bankAccountProcessor');
const logger = require('./logger');

(async function() {
  logger.info("Service launching");
  for (const userData of users) {
    const { key } = userData;
    const userConfig = await getSecret(key);
    await processUser(JSON.parse(userConfig));
  }
})();
