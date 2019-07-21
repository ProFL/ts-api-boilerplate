import {EntitySchema, getConnection, Repository} from 'typeorm';

export default function getRepository<T>(
  target: string | Function | EntitySchema<T> | (new () => T),
): Repository<T> {
  return getConnection().getRepository(target);
}
