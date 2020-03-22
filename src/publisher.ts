import { SNS } from 'aws-sdk';
import { PublisherConfig, TransactionsMessage } from './types';
import logger from './logger';

export const publish = async (config: PublisherConfig, message: TransactionsMessage): Promise<boolean> => {
  switch (config.type) {
    case 'sns':
      return await publishToSns(config.address, message);
    default:
      throw new Error('Unsupported publisher config');
  }
};

export const publishToSns = async (topicArn, message: TransactionsMessage): Promise<boolean> => {
  const sns = new SNS({ apiVersion: '2010-03-31', region: 'ap-southeast-2' });

  var params = {
    Message: JSON.stringify(message),
    TopicArn: topicArn,
  };

  try {
    logger.info(
      `Publishing to ${topicArn}. Bank: ${message.bankId}. Account Name: ${message.accountName}. Usernmae: ${message.username}`,
    );
    await sns.publish(params).promise();
    return true;
  } catch (err) {
    logger.error('Could not publish message.', err);
    return false;
  }
};
