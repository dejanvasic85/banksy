import { SecretsManager } from 'aws-sdk';
import logger from './logger';
import { config } from './config';
import { readFileSync }  from 'fs';

const client = new SecretsManager({
  region: 'ap-southeast-2',
});

export const getSecret = async (secretName: string): Promise<string> => {
  logger.info(`Fetching secret [${secretName}] please wait...`);

  if (config.useLocalSecrets) {
    const fileName = `secret-${secretName}.json`;
    const data = readFileSync(fileName, 'utf8');
    return data;
  }

  try {
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    return data.SecretString;
  } catch (err) {
    logger.error(`Failed fetching secret.`, err);
    return null;
  }
};
