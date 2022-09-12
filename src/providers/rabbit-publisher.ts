import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';

import { EmailType } from '@/modules/emails/emails.service';

import { dlExchange } from '@/transporter/rabbit-send-email.strategy';

import { rabbitmqConfig } from '../config';

export interface RabbitMailPublisherMessage<T> {
  to: string;
  type: EmailType;
  payload: T;
}
export interface RabbitMailPublisherParams<T> {
  data: RabbitMailPublisherMessage<T>;
}

export class RabbitMailPublisher {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  private connect() {
    this.connection = amqp.connect([rabbitmqConfig.host], {
      findServers: () => rabbitmqConfig.host,
    });
  }

  private async close() {
    if (this.connection.isConnected()) {
      await this.connection.close();
    }
  }

  async toQueue(data: RabbitMailPublisherParams<any>) {
    try {
      if (!this.connection) {
        this.connect();
      }

      const channel = this.connection.createChannel();

      channel.publish(dlExchange, 'send', Buffer.from(JSON.stringify(data)));

      setTimeout(async () => await this.close(), 3000);
    } catch (error) {
      throw error;
    }
  }
}
