import * as prompt from 'password-prompt';
import { encrypt } from './encrypt';

const generate = async () => {

  const username = await prompt('username: ');
  const password = await prompt('password: ');

  console.log('out:', encrypt(`${username}|${password}`));
}

generate();
