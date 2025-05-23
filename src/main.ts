import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import cookieParser from 'cookie-parser';
import { json } from 'express';

import { AppModule } from './app.module';
import { appConfig } from './config';
import { RabbitMQMailPubSubServer } from './transporter/rabbit-send-email.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidNonWhitelisted: true }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(cookieParser());
  app.enableCors({ origin: '*', credentials: true });
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.REDIS,
  //   options: {
  //     password: redisConfig.password,
  //     host: redisConfig.host,
  //   },
  // });
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [rabbitmqConfig.host],
  //     queue: rabbitmqConfig.sendMailQueue,
  //     noAck: false,
  //   },
  // });
  app.connectMicroservice<MicroserviceOptions>({
    strategy: new RabbitMQMailPubSubServer(),
  });

  app.startAllMicroservices();

  await app.listen(appConfig.port);
}
bootstrap();
