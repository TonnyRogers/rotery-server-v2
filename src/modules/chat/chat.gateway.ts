import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { NotificationsService } from '../notifications/notifications.service';
import { ChatServiceInterface } from './interface/chat-service.interface';

import { Chat } from '@/entities/chat.entity';
import { formatChatName } from '@/utils/functions';
import { jwtValidateSocketClient } from '@/utils/jwt-websocket';
import { NotificationSubject } from '@/utils/types';

import { NotificationAlias } from '../../entities/notification.entity';
import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatProvider } from './enums/chat-provider.enum';

export interface ChatSocketPayload {
  userId: number;
}

@WebSocketGateway()
export class ChatSocketGateway {
  constructor(
    @Inject(ChatProvider.CHAT_SERVICE)
    private chatService: ChatServiceInterface,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    return jwtValidateSocketClient(client);
  }

  @SubscribeMessage('joinChat')
  async join(
    @MessageBody() data: ChatSocketPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<{ message: string; statusCode: number }> {
    await client.join(
      formatChatName(data.userId, Number(client.handshake.query.userId)),
    );
    return { message: 'Chat joined.', statusCode: 200 };
  }

  @SubscribeMessage('leaveChat')
  async leave(
    @MessageBody() data: ChatSocketPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    return await client.leave(
      formatChatName(data.userId, Number(client.handshake.query.userId)),
    );
  }

  @SubscribeMessage('sendChat')
  async send(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = Number(client.handshake.query.userId);
      if (userId === data.receiver.id) {
        throw new Error('Invalid receiver user.');
      }

      const lastMessage = await this.chatService.lastChat(
        data.receiver.id,
        userId,
      );

      const newMessage = await this.chatService.create(
        userId,
        data.receiver.id,
        {
          ...data,
          jsonData: lastMessage.jsonData,
        },
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
          alias: NotificationAlias.NEW_CHAT,
          content: `de ${newMessage.sender.username}`,
          subject: NotificationSubject.newChat,
          jsonData: newMessage,
        };

        await this.notificationsService.create(
          newMessage.receiver.id,
          newNotification,
        );
      }

      client.emit(`${chatName}:${userId}sended`, {
        message: 'Chat message sended.',
        statusCode: 201,
        payload: newMessage,
      });

      return {
        message: 'Chat message sended.',
        statusCode: 201,
        payload: newMessage,
      };
    } catch (error) {
      return error;
    }
  }

  sendBeginChat(authUserId: number, userId: number, data: Chat) {
    this.server.emit(`${formatChatName(authUserId, userId)}:begin`, data);
  }

  sendEndChat(authUserId: number, userId: number, data: Chat) {
    this.server.emit(`${formatChatName(authUserId, userId)}:end`, data);
  }
}
