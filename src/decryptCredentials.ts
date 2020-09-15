import * as prompt from 'password-prompt';
import { decrypt } from './encrypt';

const decryptCredentials = async () => {
  const credentials = await prompt('credentials: ');
  console.log(decrypt(credentials));
};

decryptCredentials();
