import { Logger } from '@nestjs/common';

import mikroormentities from './mikro-orm-entities';
import { FlushMode } from '@mikro-orm/core';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
// import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { postgresql } from './config';

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
    transactional: true,
    allOrNothing: true,
  },
  debug: !!(process.env.NODE_ENV === 'development'),
  forceUtcTimezone: true,
  timezone: 'UTC',
  logger: logger.log.bind(logger),
  // cache: {
  //   enabled: false,
  // },
  // flushMode: FlushMode.ALWAYS,
  allowGlobalContext: true,
  // autoLoadEntities: false,
  // registerRequestContext: false,
  // metadataProvider: TsMorphMetadataProvider,
} as MikroOrmModuleOptions;
