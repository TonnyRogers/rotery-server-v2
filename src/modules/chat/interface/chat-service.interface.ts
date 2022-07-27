import { Chat } from '@/entities/chat.entity';

import { CreateChatDto } from '../dto/create-chat.dto';

export interface ChatServiceInterface {
  findReceived(
    authUserId: number,
    offset: number,
    limit: number,
  ): Promise<Chat[]>;
  create(
    authUser: number,
    receiverId: number,
    createChatDto: CreateChatDto,
  ): Promise<Chat>;
  findOne(id: number): Promise<Chat>;
  conversation(authUserId: number, receiverId: number): Promise<Chat[]>;
}
