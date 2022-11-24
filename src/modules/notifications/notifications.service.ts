import { HttpException, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import {
  FirebaseNotificationPayload,
  sendToUser,
} from '../../providers/firebase';
import { CreateNotificationPayload } from './interfaces/create-notification';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: EntityRepository<Notification>,
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    @Inject(NotificationsGateway)
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    authUserId: number,
    notificationPayload: CreateNotificationPayload,
    withPush = true,
    withWebSocket = true,
    withNotification = true,
    customPushPayload?: any,
  ) {
    try {
      const user: User[] = await this.usersRepository
        .createQueryBuilder('user')
        .select('"user".id, "user".device_token')
        .where({ id: authUserId })
        .execute();

      const userDeviceToken = user[0].deviceToken;
      delete user[0].deviceToken;

      const newNotification = new Notification({
        user: user[0],
        ...notificationPayload,
      });

      if (withNotification) {
        await this.notificationRepository.persistAndFlush(newNotification);
      }

      if (withPush) {
        const wsPayload = customPushPayload
          ? customPushPayload
          : notificationPayload.jsonData;

        const fbNotificationPayload: FirebaseNotificationPayload = {
          tokenId: userDeviceToken,
          title: newNotification.subject,
          body: newNotification.content,
          data: {
            alias: newNotification.alias,
            json_data: JSON.stringify(wsPayload),
          },
        };

        await sendToUser(fbNotificationPayload);
      }

      if (withWebSocket) {
        this.notificationsGateway.send(user[0].id, {
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
