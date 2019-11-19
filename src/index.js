const { users } = require('./config');
const { getSecret } = require('./aws/secretFetcher');
const { processUser } = require('./bankAccountProcessor');

(async function() {
  for (const userData of users) {
    const { user, key } = userData;
    const userConfig = await getSecret(key);
    await processUser(JSON.parse(userConfig));
  }
})();

