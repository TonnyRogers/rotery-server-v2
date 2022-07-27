import { Inject, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { ChatServiceInterface } from './interface/chat-service.interface';

import { Chat } from '@/entities/chat.entity';

import { CreateChatDto } from './dto/create-chat.dto';
import { ChatProvider } from './enums/chat-provider.enum';
import { ChatRepositoryInterface } from './interface/chat-repository.interface';

@Injectable()
export class ChatService implements ChatServiceInterface {
  constructor(
    @Inject(ChatProvider.CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepositoryInterface,
    @Inject(UsersService)
    private readonly usersService: UsersService,
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
    const sender = await this.usersService.findOne({ id: authUser });
    const receiver = await this.usersService.findOne({ id: receiverId });

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
}
