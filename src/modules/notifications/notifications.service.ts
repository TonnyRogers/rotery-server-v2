import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Notification } from '../../entities/notification.entity';
import { UsersService } from '../users/users.service';
import { CreateNotificationPayload } from './interfaces/create-notification';
import {
  FirebaseNotificationPayload,
  sendToUser,
} from '../../providers/firebase';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: EntityRepository<Notification>,
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(NotificationsGateway)
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    authUserId: number,
    notificationPayload: CreateNotificationPayload,
    withPush = true,
    withWebSocket = true,
  ) {
    try {
      const user = await this.usersService.findOne({ id: authUserId });
      const newNotification = new Notification({
        user: 'id' in user && user,
        ...notificationPayload,
      });

      await this.notificationRepository.persistAndFlush(newNotification);

      if (withPush) {
        const fbNotificationPayload: FirebaseNotificationPayload = {
          tokenId: 'id' in user && user.deviceToken,
          title: newNotification.subject,
          body: newNotification.content,
          data: {
            alias: newNotification.alias,
            json_data: JSON.stringify(notificationPayload.jsonData),
          },
        };

        await sendToUser(fbNotificationPayload);
      }

      if (withWebSocket) {
        this.notificationsGateway.send('id' in user && user.id, {
          ...newNotification,
          jsonData: notificationPayload.jsonData,
        });
      }

      return newNotification;
    } catch (error) {
      throw new HttpException('Error on create notification.', 400);
    }
  }

  async findAll(authUserId: number) {
    try {
      return this.notificationRepository.find(
        { user: authUserId, isReaded: false },
        { orderBy: { createdAt: 'DESC' } },
      );
    } catch (error) {
      throw new HttpException('Error on find notifications.', 400);
    }
  }

  async read(authUserId: number, notificationId: number) {
    try {
      const notification = await this.notificationRepository.findOneOrFail({
        user: authUserId,
        id: String(notificationId),
      });

      await this.notificationRepository.removeAndFlush(notification);

      return;
    } catch (error) {
      throw new HttpException('Error on set notification read.', 400);
    }
  }
}
