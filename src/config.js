const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  encryptionKey: process.env.ENCRYPTION_KEY,
  mongoConnection: process.env.MONGO_CONNECTION,
  users: [
    {
      user: 'dejan',
      key: 'dejan-cba'
    }
  ]
};
