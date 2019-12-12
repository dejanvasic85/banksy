import { createLogger, transports, format } from 'winston';
import * as CloudWatchTransport from 'winston-aws-cloudwatch';
import { config } from './config';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'banksy' },
  // @ts-ignore
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'logs-errors.log', level: 'error' }),
    new transports.File({ filename: 'logs-all.log' }),

    // Everything goes to console as well
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),

    new CloudWatchTransport({
      logGroupName: 'banksy',
      logStreamName: config.logGroupStreamName,
      createLogGroup: true,
      createLogStream: true,
      submissionInterval: 1000,
      submissionRetryCount: 2,
      batchSize: 1,
      awsConfig: {
        aws_access_key_id: config.awsAccessKey,
        aws_secret_access_key: config.awsAccessSecret,
        region: config.awsAccessRegion,
      },
    }),
  ],
});

logger.on('error', err => {
  console.log('WHOA, cannot log', err);
});

export default logger;
