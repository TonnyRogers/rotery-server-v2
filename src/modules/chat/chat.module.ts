import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Chat } from '@/entities/chat.entity';
import { User } from '@/entities/user.entity';

import { DirectMessagesModule } from '../direct-messages/direct-messages.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatController } from './chat.controller';
import { chatProvider } from './providers';

@Module({
  controllers: [ChatController],
  imports: [
    MikroOrmModule.forFeature([Chat, User]),
    DirectMessagesModule,
    NotificationsModule,
  ],
  providers: chatProvider,
})
export class ChatSocketModule {}
