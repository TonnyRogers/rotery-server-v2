import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserConnectionService } from './user-connections.service';

import { UserConnection } from '../../entities/user-connection.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { UserConnectionController } from './user-connections.controller';

@Module({
  controllers: [UserConnectionController],
  providers: [UserConnectionService],
  imports: [
    MikroOrmModule.forFeature([UserConnection]),
    UsersModule,
    NotificationsModule,
  ],
  exports: [UserConnectionService],
})
export class UserConnectionModule {}
