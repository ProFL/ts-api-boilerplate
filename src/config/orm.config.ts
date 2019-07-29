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

  let connection: Connection;

  if (nodeEnv === 'test') {
    connection = await createConnection({
      type: 'sqlite',
      name: 'memory',
      database: ':memory:',
      entities: ['src/models/**/*.ts'],
      synchronize: true,
      logging: process.env.TYPEORM_LOGGING === 'true',
    });
  } else {
    const baseOpts: ConnectionOptions = {
      type: 'postgres',
      url: await getEnvSecret('TYPEORM_URL'),
      synchronize: false,
      logging: (await getEnvSecret('TYPEORM_LOGGING')) === 'true',
    };

    const finalOpts: ConnectionOptions =
      process.env.NODE_ENV === 'production'
        ? {
            ...baseOpts,
            entities: ['build/models/**/*.js'],
            migrations: ['build/migrations/**/*.js'],
            subscribers: ['build/subscribers/**/*.js'],
          }
        : {
            ...baseOpts,
            synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
            entities: ['src/models/**/*.ts'],
            migrations: ['src/migrations/**/*.ts'],
            subscribers: ['src/subscribers/**/*.ts'],
          };

    connection = await createConnection(finalOpts);
  }

  return connection;
}
