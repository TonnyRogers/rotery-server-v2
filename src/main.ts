import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { json } from 'express';
import { AppModule } from './app.module';
import { rabbitmqConfig, redisConfig } from './config';
import { RabbitMQMailPubSubServer } from './transporter/rabbit-send-email.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  await app.listen(3333);
}
bootstrap();
