import { config } from 'dotenv';

const { NODE_ENV } = process.env;

const envFile = `.env`;

config({ path: envFile });

const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'API_SECRET',
  'ORM_LOG_ENABLED',
  'API_SECRET',
  'API_TOKEN_EXPIRES',
];

REQUIRED_ENV_VARS.forEach((envVar) => {
  const val = process.env[envVar];
  if (val === '' || val === null || val === undefined) {
    throw new Error(`Required ENV VAR not set: ${envVar}`);
  }
});

export const postgresql = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.SYNC_DB,
  logging: process.env.ORM_LOG_ENABLED,
};

export const jwtOptions = {
  secret: process.env.API_SECRET,
  expireTime: process.env.API_TOKEN_EXPIRES,
};

export const digitalSpaces = {
  key: process.env.SPACES_KEY,
  secret: process.env.SPACES_SECRET,
  endpoint: process.env.SPACES_ENDPOINT,
  bucket: process.env.SPACES_BUCKET,
};
