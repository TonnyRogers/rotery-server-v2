import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';
import { DirectMessage } from '../../entities/direct-message.entity';
import { NotificationsModule } from '../notifications/notifications.module';

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
