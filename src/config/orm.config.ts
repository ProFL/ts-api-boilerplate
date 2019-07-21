import {Connection, createConnection} from 'typeorm';
import getEnvSecret from '../helpers/get-env-secret.helper';

export default async function ormConfig(): Promise<Connection> {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === 'test') {
    return createConnection({
      type: 'sqlite',
      name: 'memory',
      database: ':memory:',
      entities: ['src/models/**/*.ts'],
      synchronize: true,
      logging: process.env.TYPEORM_LOGGING === 'true',
    });
  }

  const typeormUrl = await getEnvSecret('TYPEORM_URL');
  if (typeormUrl) {
    return createConnection({
      type: 'postgres',
      url: await getEnvSecret('TYPEORM_URL'),
      synchronize: false,
      logging: (await getEnvSecret('TYPEORM_LOGGING')) === 'true',
      entities: ['build/models/**/*.js'],
      migrations: ['build/migrations/**/*.js'],
      subscribers: ['build/subscribers/**/*.js'],
    });
  }

  return createConnection();
}
