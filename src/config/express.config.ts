import * as express from 'express';
import * as morgan from 'morgan';
import getEnvSecret from '../helpers/get-env-secret.helper';

export default async function expressConfig(): Promise<express.Application> {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());

  app.set('env', await getEnvSecret('NODE_ENV'));

  return app;
}
