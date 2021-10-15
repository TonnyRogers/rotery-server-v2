import { Inject, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationAlias } from 'src/entities/notification.entity';
import { formatChatName } from 'utils/functions';
import { NotificationSubject } from 'utils/types';
import { WsJwtGuard } from '../auth/ws.guard';
import { DirectMessagesService } from '../direct-messages/direct-messages.service';
import { CreateDirectMessageDto } from '../direct-messages/dto/create-message.dto';
import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { NotificationsService } from '../notifications/notifications.service';

export interface ChatSocketPayload {
  userId: number;
  ownerId: number;
}

@WebSocketGateway()
export class ChatSocketGateway {
  constructor(
    @Inject(DirectMessagesService)
    private directMessagesService: DirectMessagesService,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinChat')
  join(
    @MessageBody() data: ChatSocketPayload,
    @ConnectedSocket() client: Socket,
  ): Record<string, any> {
    client.join(formatChatName(data.userId, data.ownerId));
    return { message: 'Chat joined.', statusCode: 200 };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveChat')
  leave(
    @MessageBody() data: ChatSocketPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(formatChatName(data.userId, data.ownerId));
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendChat')
  async send(
    @MessageBody() data: CreateDirectMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = Number(client.handshake.query.userId);
      const newMessage = await this.directMessagesService.create(
        userId,
        data.receiver.id,
        data,
      );
      const chatName = formatChatName(data.receiver.id, userId);

      const clients = this.server.sockets.adapter.rooms.get(chatName);

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
        this.server.emit(chatName, newMessage);
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

      return { message: 'Message sended.', statusCode: 201 };
    } catch (error) {
      return error;
    }
  }
}
