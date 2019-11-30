import { SNS } from 'aws-sdk';
import { BankTransaction } from './types';
import logger from './logger';

const sns = new SNS({ apiVersion: '2010-03-31', region: 'ap-southeast-2' });

export const publishTransaction = async (topicArn, transactions: BankTransaction[]): Promise<boolean> => {
  var params = {
    Message: JSON.stringify(transactions),
    TopicArn: topicArn,
  };

  try {
    const result = await sns.publish(params).promise();
    logger.info(`Published messages to ${topicArn} successfully.`);
    return true;
  } catch (err) {
    logger.error('Could not publish message.', err);
    return false;
  }
};
