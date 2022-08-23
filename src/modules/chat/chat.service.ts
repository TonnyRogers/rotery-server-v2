import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { NotificationsService } from '../notifications/notifications.service';
import {
  CanBeginChatResponse,
  ChatServiceBeginChartParams,
  ChatServiceInterface,
} from './interface/chat-service.interface';

import { Chat, ChatType } from '@/entities/chat.entity';
import { NotificationAlias } from '@/entities/notification.entity';
import { SubscriptionStatus } from '@/entities/subscription.entity';
import { dayjsPlugins } from '@/providers/dayjs-config';
import { NotificationSubject } from '@/utils/types';

import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { UsersRepositoryInterface } from '../users/interfaces/users-repository.interface';
import { BeginChatDto } from './dto/begin-chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatProvider } from './enums/chat-provider.enum';
import { ChatRepositoryInterface } from './interface/chat-repository.interface';

@Injectable()
export class ChatService implements ChatServiceInterface {
  constructor(
    @Inject(ChatProvider.CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepositoryInterface,
    @Inject(UsersProvider.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
  ) {}

  async findReceived(
    authUserId: number,
    offset = 1,
    limit = 10,
  ): Promise<Chat[]> {
    return await this.chatRepository.findReceived({
      authUserId,
      limit,
      offset,
    });
  }

  async create(
    authUser: number,
    receiverId: number,
    createChatDto: CreateChatDto,
  ): Promise<Chat> {
    const sender = await this.usersRepository.findOne({ id: authUser });
    const receiver = await this.usersRepository.findOne({ id: receiverId });

    const newChat = new Chat({
      ...createChatDto,
      sender,
      receiver,
    });

    return await this.chatRepository.create(newChat);
  }

  async findOne(id: number): Promise<Chat> {
    return this.chatRepository.findOne({ id });
  }

  async conversation(authUserId: number, receiverId: number): Promise<Chat[]> {
    return this.chatRepository.findConversation({
      authUserId,
      receiverId,
    });
  }

  async beginChat(
    { authUserId, receiverId }: ChatServiceBeginChartParams,
    { locationCityState, locationName, locationId }: BeginChatDto,
  ): Promise<Chat> {
    if (authUserId === receiverId) {
      throw new HttpException(
        "Can't start chat with yourselfe.",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.usersRepository.findOne({ id: authUserId });
    const guideUser = await this.usersRepository.findOne({ id: receiverId });

    if (!user || !guideUser) {
      throw new UnprocessableEntityException("Can't find this user.");
    }

    if (!guideUser.isHost) {
      throw new HttpException(
        "Can't begin chat with this user.",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const chatBegin = new Chat({
      receiver: guideUser,
      sender: user,
      message: `Novo chat iniciado: ${user.username} solicitou ajuda sobre ${locationName} (${locationCityState}).`,
      type: ChatType.BEGIN,
      jsonData: { locationId, locationName, locationCityState },
    });

    await this.chatRepository.create(chatBegin);

    const notificationPayload: CreateNotificationPayload = {
      alias: NotificationAlias.NEW_CHAT,
      subject: NotificationSubject.newChat,
      content: `chat iniciado com ${user.username}`,
      jsonData: {
        ...chatBegin,
      },
    };

    await this.notificationsService.create(guideUser.id, notificationPayload);

    return chatBegin;
  }

  async endChat(
    { authUserId, receiverId }: ChatServiceBeginChartParams,
    { locationCityState, locationName, locationId }: BeginChatDto,
  ): Promise<Chat> {
    if (authUserId === receiverId) {
      throw new HttpException(
        "Can't end this invalid chat.",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const authUser = await this.usersRepository.findOne({ id: authUserId });
    const user = await this.usersRepository.findOne({ id: receiverId });

    if (!user || !authUser) {
      throw new UnprocessableEntityException("Can't find this user.");
    }

    const lastChat = await this.chatRepository.findLast({
      order: 'DESC',
      receiverId: user.id,
      senderId: authUser.id,
    });

    if (lastChat.type === ChatType.END)
      throw new HttpException('Chat already ended.', HttpStatus.BAD_REQUEST);

    const chatFinished = new Chat({
      receiver: user,
      sender: authUser,
      message: `Chat finalizado: ${authUser.username} finalizou o chat.`,
      type: ChatType.END,
      jsonData: { locationId, locationName, locationCityState },
    });

    const newEndChat = await this.chatRepository.create(chatFinished);

    if (authUser.isHost) {
      const notificationPayload: CreateNotificationPayload = {
        alias: NotificationAlias.LOCATION_RATE,
        subject: NotificationSubject.locationRate,
        content: `com ${authUser.username}`,
        jsonData: {
          guide: {
            id: authUser.id,
            username: authUser.username,
            createdAt: authUser.createdAt,
            profile: authUser.profile,
          },
          location: {
            id: locationId,
            name: locationName,
            state: locationCityState,
          },
        },
      };

      await this.notificationsService.create(user.id, notificationPayload);
    }

    return newEndChat;
  }

  async lastChat(authUser: number, receiverId: number): Promise<Chat> {
    return await this.chatRepository.findLast({
      receiverId: authUser,
      senderId: receiverId,
      order: 'DESC',
    });
  }

  async canBeginChat(authUserId: number): Promise<CanBeginChatResponse> {
    const user = await this.usersRepository.findOne({ id: authUserId }, [
      'subscription',
    ]);

    if (
      user.subscription
        .getItems()
        .some(
          (subs) =>
            subs.status === SubscriptionStatus.AUTHORIZED &&
            subs.deletedAt === null,
        )
    ) {
      return {
        allowed: true,
        message: 'Ok',
      };
    }

    const lastChaAsOwner = await this.chatRepository.findLast({
      order: 'DESC',
      senderId: user.id,
      type: ChatType.END,
    });

    const lastChatAsTarget = await this.chatRepository.findLast({
      order: 'DESC',
      receiverId: user.id,
      type: ChatType.END,
    });

    const todayMonth = dayjsPlugins().month();

    if (
      dayjsPlugins(lastChaAsOwner.createdAt).month() === todayMonth ||
      dayjsPlugins(lastChatAsTarget.createdAt).month() === todayMonth
    ) {
      return {
        allowed: false,
        message: 'Chat limit reached.',
      };
    }
  }
}
