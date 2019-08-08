import {useContainer} from 'class-validator';
import * as Koa from 'koa';
import * as path from 'path';
import 'reflect-metadata';
import {useKoaServer} from 'routing-controllers';
import Container from 'typedi';
import {CustomAppState} from '../helpers/interfaces/koa-context.interface';
import authConfig from './auth.config';
import constantsConfig from './constants.config';
import koaConfig from './koa.config';
import mailConfig from './mail.config';
import ormConfig from './orm.config';
import loggerConfig from './logger.config';

export default async function appConfig(): Promise<Koa<CustomAppState, {}>> {
  const app = await koaConfig();

  useContainer(Container); // class-validator

  await constantsConfig();

  await ormConfig();

  await loggerConfig();

  await mailConfig();

  const controllersDir = path.resolve(__dirname, '..', 'controllers');
  const {authorizationChecker, currentUserChecker} = authConfig();
  useKoaServer(app, {
    controllers: [
      `${controllersDir}/**/*.controller.js`,
      `${controllersDir}/**/*.controller.ts`,
    ],
    authorizationChecker,
    currentUserChecker,
    cors: true,
  });

  return app;
}
