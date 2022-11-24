import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { NotificationsService } from './notifications.service';

import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { UsersRepository } from '../users/users.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  controllers: [NotificationsController],
  imports: [MikroOrmModule.forFeature([Notification, User])],
  providers: [
    NotificationsService,
    NotificationsGateway,
    { provide: UsersProvider.USERS_REPOSITORY, useClass: UsersRepository },
  ],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
