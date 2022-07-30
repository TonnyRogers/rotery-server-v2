import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ChatServiceInterface } from './interface/chat-service.interface';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatSocketGateway } from './chat.gateway';
import { BeginChatDto } from './dto/begin-chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatProvider } from './enums/chat-provider.enum';

@Controller('chats')
export class ChatController {
  constructor(
    @Inject(ChatProvider.CHAT_SERVICE)
    private chatService: ChatServiceInterface,
    @Inject(ChatProvider.CHAT_GATEWAY)
    private readonly chatSocketGateway: ChatSocketGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  sendChatMessage(
    @Param() params: { id: number },
    @Req() request: RequestUser,
    @Body() createDirectMessageDto: CreateChatDto,
  ) {
    return this.chatService.create(request.user.userId, params.id, {
      ...createDirectMessageDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserChatMessages(
    @Req() request: RequestUser,
    @Query() query: { offset: number; limit: number },
  ) {
    return this.chatService.findReceived(
      request.user.userId,
      query.offset,
      query.limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  getChatConversation(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.chatService.conversation(request.user.userId, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/begin')
  async beginChat(
    @Param() params: { id: number },
    @Req() request: RequestUser,
    @Body() body: BeginChatDto,
  ) {
    const beginChatItem = await this.chatService.beginChat(
      {
        authUserId: request.user.userId,
        receiverId: params.id,
      },
      body,
    );

    this.chatSocketGateway.sendBeginChat(
      request.user.userId,
      params.id,
      beginChatItem,
    );

    return beginChatItem;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/end')
  async endChat(
    @Param() params: { id: number },
    @Req() request: RequestUser,
    @Body() body: BeginChatDto,
  ) {
    const endChatItem = await this.chatService.endChat(
      {
        authUserId: request.user.userId,
        receiverId: params.id,
      },
      body,
    );

    this.chatSocketGateway.sendEndChat(
      request.user.userId,
      params.id,
      endChatItem,
    );

    return endChatItem;
  }
}
