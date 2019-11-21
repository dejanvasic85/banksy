const Cryptr = require('cryptr');
const { encryptionKey } = require('./config');
const cryptr = new Cryptr(encryptionKey);

const encrypt =  (value) => {
  return cryptr.encrypt(value);
};

const decrypt = (value) => {
  return cryptr.decrypt(value);
}

module.exports = {
  encrypt,
  decrypt
};
