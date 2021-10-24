import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';
import { postgresql } from './config';
import mikroormentities from './mikro-orm-entities';

const { database, host, password, username, port } = postgresql;
const logger = new Logger('MikroORM');
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
  debug: !!(process.env.NODE_ENV === 'development'),
  forceUtcTimezone: true,
  tsNode: true,
  timezone: 'UTC',
  logger: logger.log.bind(logger),
} as MikroOrmModuleOptions;
