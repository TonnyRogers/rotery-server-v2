import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

export class RabbitMQMailPubSubClient extends ClientProxy {
  async connect(): Promise<any> {
    console.log('connect');
  }
  async close() {
    console.log('close');
  }
  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    console.log('event to dispatch: ', packet);
  }
  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    console.log('message: ', packet);

    callback({ response: packet.data });

    return () => console.log('teardown');
  }
}
