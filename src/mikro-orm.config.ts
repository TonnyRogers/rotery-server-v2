import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { postgresql } from './config';
import mikroormentities from './mikro-orm-entities';

const { database, host, password, username, port, logging } = postgresql;

export default {
  ...mikroormentities,
  host,
  password,
  user: username,
  dbName: database,
  port: Number(port),
  type: 'postgresql',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: process.cwd() + '/migrations',
    pattern: /^[\w-]+\d+\.ts$/,
    transactional: true,
    emit: 'ts',
    allOrNothing: true,
  },
  debug: logging === 'true' ? true : false,
  forceUtcTimezone: true,
  tsNode: true,
} as MikroOrmModuleOptions;
