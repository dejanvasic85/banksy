import * as Cryptr from 'cryptr';

const encryptionKey = 'cac7989a-ace1-4a1d-ad43-ccb02c8fdb7b';

export const encrypt = (value: string): string => {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.encrypt(value);
};

export const decrypt = (value: string): string => {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.decrypt(value);
};
