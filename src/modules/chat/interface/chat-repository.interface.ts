import { Chat } from '@/entities/chat.entity';

export interface ChatQueryFilter {
  id?: number;
  authUserId?: number;
  receiverId?: number;
  senderId?: number;
  offset: number;
  limit: number;
}

export interface ChatRepositoryFindLastParams {
  order: 'DESC' | 'ASC';
  senderId: number;
  receiverId: number;
}

export interface ChatRepositoryInterface {
  create(entity: Chat): Promise<Chat>;
  findOne(query: Pick<ChatQueryFilter, 'id' | 'senderId'>): Promise<Chat>;
  findConversation(
    query: Pick<ChatQueryFilter, 'authUserId' | 'receiverId'>,
  ): Promise<Chat[]>;
  findReceived(
    query: Pick<ChatQueryFilter, 'authUserId' | 'offset' | 'limit'>,
  ): Promise<Chat[]>;
  findLast(query: ChatRepositoryFindLastParams): Promise<Chat>;
}
