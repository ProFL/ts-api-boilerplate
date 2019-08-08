import * as winston from 'winston';
import Container from 'typedi';
import {CONSTANT_KEYS} from '../helpers/enums/constants.enum';

export default async function loggerConfig(): Promise<void> {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({filename: 'error.log', level: 'error'}),
      new winston.transports.File({filename: 'combined.log'}),
      new winston.transports.Console({format: winston.format.simple()}),
    ],
  });

  Container.set(CONSTANT_KEYS.LOGGER, logger);
}
