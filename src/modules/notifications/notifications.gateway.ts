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

  send(userId: number, data: any) {
    this.server.emit(`notify:${userId}`, data);
  }
}
