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

import { DirectMessagesService } from './direct-messages.service';

import { RequestUser } from '@/utils//types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDirectMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class DirectMessagesController {
  constructor(
    @Inject(DirectMessagesService)
    private directMessageService: DirectMessagesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  sendMessage(
    @Param() params: { id: number },
    @Req() request: RequestUser,
    @Body() createDirectMessageDto: CreateDirectMessageDto,
  ) {
    return this.directMessageService.create(request.user.userId, params.id, {
      ...createDirectMessageDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserMessages(
    @Req() request: RequestUser,
    @Query() query: { offset: number; limit: number },
  ) {
    return this.directMessageService.findReceived(
      request.user.userId,
      query.offset,
      query.limit,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  getConversation(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.directMessageService.conversation(
      request.user.userId,
      params.id,
    );
  }
}
