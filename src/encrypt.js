const Cryptr = require('cryptr');
const { key } = require('./config');
const cryptr = new Cryptr(key);

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
