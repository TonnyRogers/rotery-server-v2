import ioredis from 'ioredis';

import { EmailType } from '../modules/emails/emails.service';

import { redisConfig } from '../config';

export interface RedisPlublishPayload {
  type: EmailType;
  payload: {
    name: string;
    email: string;
    resetcode?: number;
    activationCode?: number;
  };
}

const redis = new ioredis({
  host: redisConfig.host,
  password: redisConfig.password,
});

const subscriber = new ioredis({
  host: redisConfig.host,
  password: redisConfig.password,
});

const sendMailChannel = 'send_email';

// subscriber.subscribe(`${sendMailChannel}`);

// subscriber.on('message', (channel, message) => {
//   const payload = JSON.parse(message);
//   console.log({ payload, channel });
// });

// async function getAll(): Promise<any> {
//   const emailsResults = await redis.keys(`${sendMailChannel}:*`);

//   const values = await redis.mget(emailsResults);

//   console.log(JSON.parse(`[${values.join(',')}]`));

//   return JSON.parse(`[${values.join(',')}]`);
// }

async function publish(data: RedisPlublishPayload) {
  try {
    await redis.publish(sendMailChannel, JSON.stringify(data));
  } catch (error) {
    return error;
  }
}

export { subscriber, publish };
