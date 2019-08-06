import * as path from 'path';
import Container from 'typedi';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  useContainer,
} from 'typeorm';
import getEnvSecret from '../helpers/get-env-secret.helper';

export default async function ormConfig(): Promise<Connection> {
  const nodeEnv = process.env.NODE_ENV;

  useContainer(Container);

  let connOpts: ConnectionOptions;

  if (nodeEnv === 'test') {
    connOpts = {
      type: 'sqlite',
      name: 'memory',
      database: ':memory:',
      entities: ['src/models/**/*.ts'],
      synchronize: true,
      logging: process.env.TYPEORM_LOGGING === 'true',
    };
  } else {
    const baseOpts: ConnectionOptions = {
      type: 'postgres',
      url: await getEnvSecret('TYPEORM_URL'),
      synchronize: false,
      logging: (await getEnvSecret('TYPEORM_LOGGING')) === 'true',
    };

    let rootDir: string;
    let fileFormat: string;
    let synchronize: boolean;

    if (process.env.NODE_ENV === 'production') {
      rootDir = 'build';
      fileFormat = '*.js';
      synchronize = false;
    } else {
      rootDir = 'src';
      fileFormat = '*.ts';
      synchronize = (await getEnvSecret('TYPEORM_SYNCHRONIZE')) === 'true';
    }

    connOpts = {
      ...baseOpts,
      synchronize,
      entities: [path.join(rootDir, 'models', '**', fileFormat)],
      migrations: [path.join(rootDir, 'migrations', '**', fileFormat)],
      subscribers: [path.join(rootDir, 'subscribers', '**', fileFormat)],
    };
  }

  return createConnection(connOpts);
}
