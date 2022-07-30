import { Chat } from '@/entities/chat.entity';

import { BeginChatDto } from '../dto/begin-chat.dto';
import { CreateChatDto } from '../dto/create-chat.dto';

export interface ChatServiceBeginChartParams {
  authUserId: number;
  receiverId: number;
}

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
  beginChat(
    params: ChatServiceBeginChartParams,
    beginDto: BeginChatDto,
  ): Promise<Chat>;
  endChat(
    params: ChatServiceBeginChartParams,
    endDto: BeginChatDto,
  ): Promise<Chat>;
}
