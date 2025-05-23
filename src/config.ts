import { config } from 'dotenv';

const { NODE_ENV } = process.env;

const envFile = `.env`;

config({ path: envFile });

const REQUIRED_ENV_VARS = [
  'PORT',
  'HOST',
  'URL_HOST',
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
  'REDIS_HOST',
  'REDIS_PASSWORD',
  'FIREBASE_DB_URL',
  'RABBITMQ_HOST',
  'SEND_MAIL_QUEUE',
  'PAYMENT_API_TOKEN_PROD',
  'PAYMENT_API_URL',
  'PAYMENT_PLAN_API_URL',
  'PAYMENT_WEBHOOK',
];

REQUIRED_ENV_VARS.forEach((envVar) => {
  const val = process.env[envVar];
  if (val === '' || val === null || val === undefined) {
    throw new Error(`Required ENV VAR not set: ${envVar}`);
  }
});

export const appConfig = {
  port: process.env.PORT,
  host: process.env.HOST,
  url: process.env.URL_HOST,
  emailFrom: process.env.EMAIL_FROM,
};

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

export const smtp = {
  connection: process.env.MAIL_CONNECTION,
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
};

export const firebaseConfig = {
  baseUrl: process.env.FIREBASE_DB_URL,
};

export const redisConfig = {
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};

export const paymentApiOptions = {
  token:
    NODE_ENV === 'production'
      ? process.env.PAYMENT_API_TOKEN_PROD
      : process.env.PAYMENT_API_TOKEN_DEV,
  url: process.env.PAYMENT_API_URL,
  plan_url: process.env.PAYMENT_PLAN_API_URL,
  webhook: process.env.PAYMENT_WEBHOOK,
};

export const rabbitmqConfig = {
  host: `amqp://${process.env.RABBITMQ_HOST}:5672`,
  sendMailQueue: process.env.SEND_MAIL_QUEUE,
};
