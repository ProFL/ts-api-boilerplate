import * as path from 'path';
import Container from 'typedi';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  useContainer,
} from 'typeorm';
import getEnvSecret from '../helpers/get-env-secret.helper';

export interface DatabaseConnections {
  default: Connection;
}

export default async function ormConfig(): Promise<DatabaseConnections> {
  const nodeEnv = await getEnvSecret('NODE_ENV');

  useContainer(Container);

  let defaultConnOpts: ConnectionOptions;
  const fileExtension = nodeEnv === 'production' ? '*.js' : '*.ts';

  const rootDir = path.resolve(__dirname, '..');
  const entitiesBaseDir = path.join(rootDir, 'entities');
  const migrationsBaseDir = path.join(rootDir, 'migrations');
  const subscribersBaseDir = path.join(rootDir, 'subscribers');

  const defaultConfigs = {
    default: {
      entities: [path.join(entitiesBaseDir, 'default', '**', fileExtension)],
      migrations: [
        path.join(migrationsBaseDir, 'default', '**', fileExtension),
      ],
      subscribers: [
        path.join(subscribersBaseDir, 'default', '**', fileExtension),
      ],
    },
  };

  if (nodeEnv === 'test') {
    defaultConnOpts = {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: process.env.TYPEORM_LOGGING === 'true',
      ...defaultConfigs.default,
    };
  } else {
    defaultConnOpts = {
      type: 'postgres',
      username: await getEnvSecret('TYPEORM_USERNAME'),
      password: await getEnvSecret('TYPEORM_PASSWORD'),
      host: await getEnvSecret('TYPEORM_HOST'),
      database: 'tsapi_boilerplate',
      synchronize:
        nodeEnv !== 'production' &&
        /true/i.test(await getEnvSecret('TYPEORM_SYNCHRONIZE')),
      logging: (await getEnvSecret('TYPEORM_LOGGING')) === 'true',
      ...defaultConfigs.default,
    };
  }

  const defaultConn = await createConnection(defaultConnOpts);

  return {
    default: defaultConn,
  };
}
