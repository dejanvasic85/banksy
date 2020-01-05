import * as mongoose from 'mongoose';
import { config } from '../config';

export const connect = async () : Promise<any> => {
  return new Promise((res, rej) => {
    const connection = mongoose.connection;
    
    connection.on('error', () => {
      rej('Mongo refused to connect. Check connection string.');
    });

    connection.on('open', () => {
      res('Database Connected!');
    });

    mongoose.connect(config.mongoConnection, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  });
};
