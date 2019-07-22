import {useContainer} from 'class-validator';
import * as Koa from 'koa';
import * as path from 'path';
import 'reflect-metadata';
import {useKoaServer} from 'routing-controllers';
import Container from 'typedi';
import koaConfig from './koa.config';
import ormConfig from './orm.config';
import PassportConfigFactory from './passport.config';

export default async function appConfig(): Promise<Koa> {
  const app = await koaConfig();

  useContainer(Container);

  await ormConfig();

  app.use(await new PassportConfigFactory().build());

  const controllersDir = path.resolve(__dirname, '..', 'controllers');
  useKoaServer(app, {
    controllers: [
      `${controllersDir}/**/*.controller.js`,
      `${controllersDir}/**/*.controller.ts`,
    ],
  });

  return app;
}
