import { config } from './config';
import { getSecret } from './secretFetcher';
import { processUser } from './bankAccountProcessor';
import logger from './logger';
import { connect } from './db/connect';
import { UserConfig } from './types';

const start = async () => {
  try {
    logger.info("Service launching. Connecting to mongo");
    const result = await connect();

    logger.info(result);
    for (const userData of config.users) {
      const { secretKey } = userData;
      const userSecret = await getSecret(secretKey);
      if (userSecret) {
        const userConfig : UserConfig = JSON.parse(userSecret);
        await processUser(userConfig);
      }
    }
    process.exit(0);
  }
  catch (err) {
    logger.error("Crash! Something went completely wrong.", err);
    process.exit(1);
  }
};

start();