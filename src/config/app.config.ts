import {Application} from 'express';
import getControllers from '../controllers';
import expressConfig from './express.config';
import ormConfig from './orm.config';
import passportConfig from './passport.config';

export default async function appConfig(): Promise<Application> {
  const app = await expressConfig();
  const dbConnection = await ormConfig();

  app.set('dbConnection', dbConnection);

  app.use(await passportConfig());

  (await getControllers()).forEach(router => app.use(router));

  return app;
}
