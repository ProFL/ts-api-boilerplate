import {useContainer} from 'class-validator';
import * as Koa from 'koa';
import * as path from 'path';
import 'reflect-metadata';
import {useKoaServer} from 'routing-controllers';
import Container from 'typedi';
import constantsConfig from './constants.config';
import koaConfig from './koa.config';
import ormConfig from './orm.config';

export default async function appConfig(): Promise<Koa> {
  const app = await koaConfig();

  useContainer(Container); // class-validator

  await ormConfig();

  await constantsConfig();

  const controllersDir = path.resolve(__dirname, '..', 'controllers');
  useKoaServer(app, {
    controllers: [
      `${controllersDir}/**/*.controller.js`,
      `${controllersDir}/**/*.controller.ts`,
    ],
    authorizationChecker: (action, roles) => {
      // TODO: Implementation
      return true;
    },
  });

  return app;
}
