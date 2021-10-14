import amqp, { AmqpConnectionManager } from 'amqp-connection-manager';
import { rabbitmqConfig } from '../config';

const dlExchange = 'DLX_send_email';

export class RabbitMQPublisher {
  private connection: AmqpConnectionManager;

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

  async toQueue(data: Record<any, unknown>) {
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
