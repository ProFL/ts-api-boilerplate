import Container from 'typedi';
import {Connection, createConnection, useContainer} from 'typeorm';
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
    const typeormUrl = await getEnvSecret('TYPEORM_URL');
    if (typeormUrl) {
      connection = await createConnection({
        type: 'postgres',
        url: await getEnvSecret('TYPEORM_URL'),
        synchronize: false,
        logging: (await getEnvSecret('TYPEORM_LOGGING')) === 'true',
        entities: ['build/models/**/*.js'],
        migrations: ['build/migrations/**/*.js'],
        subscribers: ['build/subscribers/**/*.js'],
      });
    }
  }

  connection = await createConnection();

  return connection;
}
