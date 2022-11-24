import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { WsJwtGuard } from '../auth/ws.guard';

@WebSocketGateway()
export class SubscriptionsGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscription')
  async join(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<{ message: string; statusCode: number }> {
    await client.join('subscriptions');
    return { message: 'Done!', statusCode: 200 };
  }

  async send(userId: number, data: Record<string, any>) {
    const clients = this.server.sockets.adapter.rooms.get('subscriptions');

    let selectedClientSocket: string | null = null;

    clients &&
      clients.forEach((client) => {
        const clienteSocket = this.server.sockets.sockets.get(client);
        if (Number(clienteSocket.handshake.query.userId) === userId) {
          selectedClientSocket = clienteSocket.id;
        }
      });

    if (selectedClientSocket) {
      this.server.to(selectedClientSocket).emit('subscription-updates', data);

      return { message: 'Ok!', statusCode: 200 };
    }

    return { message: 'Socket client not found.', statusCode: 404 };
  }
}
