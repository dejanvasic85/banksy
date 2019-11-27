import { SecretsManager } from 'aws-sdk';
import logger from './logger';

const client = new SecretsManager({
  region: 'ap-southeast-2',
});

export const getSecret = async (name: string): Promise<string> => {
  logger.info(`Fetching secret [${name}] pleast wait...`);
  try {
    const data = await client.getSecretValue({ SecretId: name }).promise();
    return data.SecretString;
  } catch (err) {
    logger.error(`Failed fetching secret.`, err);
    return null;
  }
};
