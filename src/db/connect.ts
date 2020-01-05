import * as mongoose from 'mongoose';
import { config } from '../config';

let cachedConnection: mongoose.Connection;

export const connect = async (): Promise<mongoose.Connection> => {
  return new Promise((res, rej) => {
    if (cachedConnection) {
      res(cachedConnection);
    }

    const connection = mongoose.connection;

    connection.on('error', () => {
      rej('Mongo refused to connect. Check connection string.');
    });

    connection.on('open', () => {
      cachedConnection = connection;
      res(cachedConnection);
    });

    mongoose.connect(config.mongoConnection, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  });
};
