const { key, users } = require('./config');
const { encrypt } = require('./encrypt');
const { getSecret } = require('./aws/secretFetcher');

(async function() {

  //logger.log('Starting... users to process:', users.length);

  // start
  for (const user of users) {
    

    const userConfig = await getSecret(user.key);

    
    

  }

  

})();

