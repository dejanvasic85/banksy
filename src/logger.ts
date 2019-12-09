import { createLogger, transports, format } from 'winston';
import { config } from './config';
import { SumoLogic } from 'winston-sumologic-transport';

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
  ],
});

if (config.sumoLogicUrl) {
  logger.transports.push(
    // @ts-ignore
    new SumoLogic({
      url: config.sumoLogicUrl,
      interval: 5,
      onError: async err => {
        // Just log it to the console
        console.log('sumo log error', err);
      },
    }),
  );
}

export default logger;
