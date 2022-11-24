import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { DirectMessagesService } from './direct-messages.service';

import { DirectMessage } from '../../entities/direct-message.entity';
import { User } from '../../entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { DirectMessagesController } from './direct-messages.controller';

@Module({
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService],
  imports: [
    MikroOrmModule.forFeature([DirectMessage, User]),
    UsersModule,
    NotificationsModule,
  ],
  exports: [DirectMessagesService],
})
export class DirectMessagesModule {}
