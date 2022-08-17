import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Chat } from '@/entities/chat.entity';

import {
  ChatQueryFilter,
  ChatRepositoryFindLastParams,
  ChatRepositoryInterface,
} from './interface/chat-repository.interface';

const chatPopulate: any[] = ['sender.profile.file', 'receiver.profile.file'];

export class ChatRepository implements ChatRepositoryInterface {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: EntityRepository<Chat>,
  ) {}
  async create(entity: Chat): Promise<Chat> {
    const newChat = this.chatRepository.create(entity);
    await this.chatRepository.persistAndFlush(newChat);
    return newChat;
  }

  async findOne({ id }: Pick<ChatQueryFilter, 'id'>): Promise<Chat> {
    try {
      return await this.chatRepository.findOne(
        {
          id,
        },
        {
          populate: chatPopulate,
        },
      );
    } catch (error) {
      throw new UnprocessableEntityException("Can't find this chat.");
    }
  }

  async findConversation({
    authUserId,
    receiverId,
  }: Pick<ChatQueryFilter, 'authUserId' | 'receiverId'>): Promise<Chat[]> {
    const chatMessages = await this.chatRepository.find(
      {
        $or: [
          { sender: receiverId, receiver: authUserId },
          { sender: authUserId, receiver: receiverId },
        ],
      },
      {
        populate: chatPopulate,
        orderBy: { createdAt: -1 },
      },
    );

    chatMessages.forEach((message) => {
      if (message.receiver.id === authUserId) {
        message.readed = true;

        this.chatRepository.persist(message);
      }
    });

    await this.chatRepository.flush();

    return chatMessages;
  }

  async findReceived({
    authUserId,
    limit,
    offset,
  }: Pick<ChatQueryFilter, 'authUserId' | 'offset' | 'limit'>): Promise<
    Chat[]
  > {
    const last = (offset - 1) * limit;

    try {
      return await this.chatRepository.find(
        {
          receiver: authUserId,
        },
        {
          populate: chatPopulate,
          orderBy: {
            createdAt: -1,
          },
        },
      );
    } catch (error) {
      throw new UnprocessableEntityException("Can't find this chat.");
    }
  }

  async findLast(query: ChatRepositoryFindLastParams): Promise<Chat> {
    const order = query.order === 'ASC' ? 1 : -1;

    return this.chatRepository.findOne(
      {
        sender: query.senderId,
        receiver: query.receiverId,
      },
      {
        orderBy: { createdAt: order },
      },
    );
  }
}
