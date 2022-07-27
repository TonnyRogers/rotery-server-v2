import { Chat } from '@/entities/chat.entity';

export interface ChatQueryFilter {
  id: number;
  authUserId: number;
  receiverId: number;
  offset: number;
  limit: number;
}

export interface ChatRepositoryInterface {
  create(entity: Chat): Promise<Chat>;
  findOne(query: Pick<ChatQueryFilter, 'id'>): Promise<Chat>;
  findConversation(
    query: Pick<ChatQueryFilter, 'authUserId' | 'receiverId'>,
  ): Promise<Chat[]>;
  findReceived(
    query: Pick<ChatQueryFilter, 'authUserId' | 'offset' | 'limit'>,
  ): Promise<Chat[]>;
}
