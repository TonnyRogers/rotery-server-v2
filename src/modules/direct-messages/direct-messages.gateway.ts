import { Inject, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { NotificationsService } from '../notifications/notifications.service';
import { DirectMessagesService } from './direct-messages.service';

import { formatDMName } from '@/utils/functions';
import { jwtValidateSocketClient } from '@/utils/jwt-websocket';
import { NotificationSubject } from '@/utils/types';

import { NotificationAlias } from '../../entities/notification.entity';
import { WsJwtGuard } from '../auth/ws.guard';
import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { CreateDirectMessageDto } from './dto/create-message.dto';

export interface MessageSocketPayload {
  userId: number;
  ownerId: number;
}

@WebSocketGateway()
export class MessageSocketGateway {
  constructor(
    @Inject(DirectMessagesService)
    private directMessagesService: DirectMessagesService,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    return jwtValidateSocketClient(client);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinDM')
  async join(
    @MessageBody() data: MessageSocketPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<{ message: string; statusCode: number }> {
    await client.join(
      formatDMName(data.userId, Number(client.handshake.query.userId)),
    );
    return { message: 'DM joined.', statusCode: 200 };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveDM')
  async leave(
    @MessageBody() data: MessageSocketPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    return await client.leave(
      formatDMName(data.userId, Number(client.handshake.query.userId)),
    );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendDM')
  async send(
    @MessageBody() data: CreateDirectMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = Number(client.handshake.query.userId);
      if (userId === data.receiver.id) {
        throw new Error('Invalid receiver user.');
      }

      const newMessage = await this.directMessagesService.create(
        userId,
        data.receiver.id,
        data,
      );

      const dmName = formatDMName(data.receiver.id, userId);

      const clients = this.server.sockets.adapter.rooms.get(dmName);

      const filteredClients = [];

      clients &&
        clients.forEach((chatClient) => {
          const clienteSocket = this.server.sockets.sockets.get(chatClient);
          filteredClients.push(clienteSocket.handshake.query.userId);
        });

      if (
        filteredClients.includes(userId) &&
        filteredClients.includes(data.receiver.id)
      ) {
        this.server.emit(dmName, newMessage);
      } else {
        const newNotification: CreateNotificationPayload = {
          alias: NotificationAlias.NEW_MESSAGE,
          content: `de ${newMessage.sender.username}`,
          subject: NotificationSubject.newMessage,
          jsonData: newMessage,
        };

        await this.notificationsService.create(
          newMessage.receiver.id,
          newNotification,
        );
      }

      client.emit(`${dmName}:${userId}sended`, {
        message: 'Message sended.',
        statusCode: 201,
        payload: newMessage,
      });

      return {
        message: 'Message sended.',
        statusCode: 201,
        payload: newMessage,
      };
    } catch (error) {
      return error;
    }
  }
}
