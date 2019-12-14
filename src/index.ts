import { config } from './config';
import { getSecret } from './secretFetcher';
import { processUser } from './bankAccountProcessor';
import logger from './logger';
import { connect } from './db/connect';
import { UserConfig } from './types';

const start = async () => {
  try {
    logger.info('Service launching. Connecting to mongo');

    const result = await connect();

    logger.info(result);
    for (const username of config.users) {
      const userSecret = await getSecret(username);
      if (userSecret) {
        const userConfig: UserConfig = JSON.parse(userSecret);
        await processUser(username, userConfig);
      }
    }
  } catch (err) {
    logger.error('Crash! Something went completely wrong.', err);
  }

  logger.on('finish', () => {
    process.exit(0);
  });

  logger.end();
};

start();
