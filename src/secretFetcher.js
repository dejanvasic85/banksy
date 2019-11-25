const AWS = require('aws-sdk');
const logger = require('./logger');

const client = new AWS.SecretsManager({
  region: 'ap-southeast-2'
});

const getSecret = async name => {
  logger.info(`Fetching secret [${name}] pleast wait...`);
  try {
    const data = await client.getSecretValue({ SecretId: name }).promise();

    if ('SecretString' in data) {
      return data.SecretString;
    }

    const buff = new Buffer(data.SecretBinary, 'base64');
    const decoded = buff.toString('ascii');
    return decoded;
  }
  catch (err) {
    logger.error(`Failed fetching secret.`, err);
    return null;
  }
};

module.exports = {
  getSecret
};