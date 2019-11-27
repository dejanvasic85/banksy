import * as Cryptr from 'cryptr';
import { config } from './config';

const cryptr = new Cryptr(config.encryptionKey);

export const encrypt =  (value) => {
  return cryptr.encrypt(value);
};

export const decrypt = (value) => {
  return cryptr.decrypt(value);
}
