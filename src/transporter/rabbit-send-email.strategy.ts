import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';
import { rabbitmqConfig } from '../config';

const tlExchange = 'TLX_send_email';
const dlExchange = 'DLX_send_email';
const serviceQueue = rabbitmqConfig.sendMailQueue;
const time10sQueue = 'TTL-Retry-10S';
const time30sQueue = 'TTL-Retry-30S';
const time50sQueue = 'TTL-Retry-50S';
const time10bindPattern = 'Retry-once';
const time30bindPattern = 'Retry-twice';
const time50bindPattern = 'Retry-thrice';
const ONE_SEC = 1000;

export class RabbitMQMailPubSubServer
  extends Server
  implements CustomTransportStrategy
{
  messageConnector: AmqpConnectionManager;
  messageChannel: ChannelWrapper | undefined;
  constructor() {
    super();
    this.messageConnector = amqp.connect([rabbitmqConfig.host]);
    this.createChannel(this.messageConnector).then(
      (channel) => (this.messageChannel = channel),
    );
  }

  async listen(callback: () => any) {
    callback();
  }

  private async createChannel(messageConnector: AmqpConnectionManager) {
    return messageConnector.createChannel({
      json: true,
      setup: async (channel: Channel) => {
        return Promise.all([
          // create exchangers
          channel.assertExchange(dlExchange, 'fanout', { durable: true }),
          channel.assertExchange(tlExchange, 'direct', { durable: true }),
          // create queues
          channel.assertQueue(serviceQueue, { durable: true }),
          channel.assertQueue(time10sQueue, {
            durable: true,
            deadLetterExchange: dlExchange,
            messageTtl: 10 * ONE_SEC,
          }),
          channel.assertQueue(time30sQueue, {
            durable: true,
            deadLetterExchange: dlExchange,
            messageTtl: 30 * ONE_SEC,
          }),
          channel.assertQueue(time50sQueue, {
            durable: true,
            deadLetterExchange: dlExchange,
            messageTtl: 50 * ONE_SEC,
          }),
          // bind queues and exchangers
          channel.bindQueue(serviceQueue, dlExchange, 'send'),
          channel.bindQueue(time10sQueue, tlExchange, time10bindPattern),
          channel.bindQueue(time30sQueue, tlExchange, time30bindPattern),
          channel.bindQueue(time50sQueue, tlExchange, time50bindPattern),
          // set cosummer
          channel.consume(
            serviceQueue,
            (msg: ConsumeMessage | null) => msg && this.queueConsumer(msg),
          ),
        ]);
      },
    });
  }

  private async queueConsumer(msg: ConsumeMessage) {
    try {
      const messageJSON = JSON.parse(msg.content.toString());

      const echoHandler = this.messageHandlers.get(
        rabbitmqConfig.sendMailQueue,
      );

      if (echoHandler) {
        const result = await echoHandler(messageJSON.data);

        if (typeof result == 'boolean') {
          this.messageChannel.ack(msg);
        } else {
          throw new Error('Error on sending e-mail.');
        }
      }
    } catch (error) {
      if (this.messageChannel) {
        const messageJSON = JSON.parse(msg.content.toString());

        if (messageJSON.retrys) {
          messageJSON.retrys += 1;
        } else {
          messageJSON.retrys = 1;
        }

        // if(data.fields.routingKey !== "Retry-1" && data.fields.routingKey !== "Retry-2"  && data.fields.routingKey !== "Retry-3" ){
        this.messageChannel.ack(msg);
        // }

        if (messageJSON.retrys === 1) {
          this.messageChannel.publish(
            tlExchange,
            time10bindPattern,
            messageJSON,
          );
          if (process.env.NODE_ENV === 'development') {
            console.log('First attempt at  ' + new Date().toISOString());
          }
        }
        if (messageJSON.retrys === 2) {
          this.messageChannel.publish(
            tlExchange,
            time30bindPattern,
            messageJSON,
          );
          if (process.env.NODE_ENV === 'development') {
            console.log('Second attempt at  ' + new Date().toISOString());
          }
        }
        if (messageJSON.retrys === 3) {
          this.messageChannel.publish(
            tlExchange,
            time50bindPattern,
            messageJSON,
          );
          if (process.env.NODE_ENV === 'development') {
            console.log('Third attempt at  ' + new Date().toISOString());
          }
        }
        if (messageJSON.retrys > 3) {
          if (process.env.NODE_ENV === 'development') {
            console.log(
              'All the attempts are exceeded hence discarding the message',
            );
          }
        }
      }
    }
  }

  async close() {
    await this.messageConnector.close();
  }
}
