import * as Cryptr from 'cryptr';
import { config } from './config';

export const encrypt = (value: string): string => {
  const cryptr = new Cryptr(config.encryptionKey);
  return cryptr.encrypt(value);
};

export const decrypt = (value: string): string => {
  const cryptr = new Cryptr(config.encryptionKey);
  return cryptr.decrypt(value);
};
