import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as morgan from 'koa-morgan';
import {useContainer} from 'routing-controllers';
import Container from 'typedi';
import {
  CustomAppState,
  CustomKoaExtensions,
} from '../helpers/interfaces/koa-context.interface';

export default async function expressConfig(): Promise<
  Koa<CustomAppState, CustomKoaExtensions>
> {
  const app = new Koa<CustomAppState, CustomKoaExtensions>();

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(bodyParser());

  useContainer(Container);

  return app;
}
