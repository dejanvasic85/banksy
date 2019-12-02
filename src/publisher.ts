import { SNS } from 'aws-sdk';
import { BankTransaction, PublisherConfig } from './types';
import logger from './logger';

export const publish = async (config: PublisherConfig, transactions: BankTransaction[]): Promise<boolean> => {
  switch (config.type) {
    case 'sns':
      return await publishToSns(config.address, transactions);
    default: 
      throw new Error('Unsupported publisher config');
  }
};

export const publishToSns = async (topicArn, transactions: BankTransaction[]): Promise<boolean> => {
  const sns = new SNS({ apiVersion: '2010-03-31', region: 'ap-southeast-2' });

  var params = {
    Message: JSON.stringify(transactions),
    TopicArn: topicArn,
  };

  try {
    await sns.publish(params).promise();
    logger.info(`Published messages to ${topicArn} successfully.`);
    return true;
  } catch (err) {
    logger.error('Could not publish message.', err);
    return false;
  }
}; 
