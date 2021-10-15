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

export interface NotificationSocketPayload {
  userId: number;
}

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('notifications')
  join(
    @MessageBody() data: NotificationSocketPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`notify:${client.handshake.query.userId}`);

    return { message: 'Notifications subscribed.', statusCode: 200 };
  }

  send(userId: number, data: any) {
    this.server.emit(`notify:${userId}`, data);
  }
}
