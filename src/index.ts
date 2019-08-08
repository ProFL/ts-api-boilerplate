import 'reflect-metadata';
import Container from 'typedi';
import {Logger} from 'winston';
import appConfig from './config/app.config';
import {CONSTANT_KEYS} from './helpers/enums/constants.enum';
import getEnvSecret from './helpers/get-env-secret.helper';

appConfig().then(async app => {
  const logger: Logger = Container.get(CONSTANT_KEYS.LOGGER);
  let port: number;

  try {
    port = parseInt(await getEnvSecret('PORT'), 10);
  } catch (err) {
    port = 3000;
  }

  app.listen(port, () => logger.info(`> Listening on ${port}`));
});
