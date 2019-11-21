const mongoose = require('mongoose');
const { mongoConnection } = require('../config');

module.exports = {
  connect: async () => {
    return new Promise((res, rej) => {
      const connection = mongoose.connection;
      connection.on('error', () => {
        rej('Mongo refused to connect. Check connection string.');
      });

      connection.on('open', () => {
        res('connected!');
      });

      mongoose.connect(mongoConnection, { useNewUrlParser: true });
    });
  }
}