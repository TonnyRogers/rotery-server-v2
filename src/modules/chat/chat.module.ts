import { Module } from '@nestjs/common';
import { DirectMessagesModule } from '../direct-messages/direct-messages.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ChatSocketGateway } from './chat.gateway';

@Module({
  providers: [ChatSocketGateway],
  imports: [DirectMessagesModule, NotificationsModule],
})
export class ChatSocketModule {}
