import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { NotificationsService } from './notifications.service';

import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  imports: [MikroOrmModule.forFeature([Notification, User])],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
