import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { Notification } from '../../entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  imports: [MikroOrmModule.forFeature([Notification, User])],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
