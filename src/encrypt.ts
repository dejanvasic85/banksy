import * as Cryptr from 'cryptr';
import { config } from './config';

const cryptr = new Cryptr(config.encryptionKey);

export const encrypt = (value: string): string => {
  return cryptr.encrypt(value);
};

export const decrypt = (value: string) : string => {
  return cryptr.decrypt(value);
};
