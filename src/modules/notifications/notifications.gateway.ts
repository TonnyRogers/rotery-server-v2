import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

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
