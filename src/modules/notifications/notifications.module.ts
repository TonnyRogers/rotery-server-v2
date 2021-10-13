import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Notification } from 'src/entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [MikroOrmModule.forFeature([Notification]), UsersModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
