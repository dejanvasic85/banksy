const AWS = require('aws-sdk');

const client = new AWS.SecretsManager({
  region: 'ap-southeast-2'
});

const getSecret = async name => {
  try {
    const data = await client.getSecretValue({ SecretId: name }).promise();

    if ('SecretString' in data) {
      return data.SecretString;
    }

    const buff = new Buffer(data.SecretBinary, 'base64');
    const decoded = buff.toString('ascii');
    return decoded;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getSecret
};

(async function() {
  const secret = await getSecret('dejan-cba');

  console.log('secret ', JSON.parse(secret));
})();