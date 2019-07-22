import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as morgan from 'koa-morgan';
import {useContainer} from 'routing-controllers';
import Container from 'typedi';

export default async function expressConfig(): Promise<Koa> {
  const app = new Koa();

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(bodyParser());

  useContainer(Container);

  return app;
}
