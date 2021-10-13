import {
  ChangeSetType,
  EntityName,
  EventSubscriber,
  FlushEventArgs,
  Subscriber,
} from '@mikro-orm/core';
import { NotificationAlias } from '../entities/notification.entity';
import { NotificationSubject } from '../../utils/types';
import { DirectMessage } from '../entities/direct-message.entity';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationPayload } from 'src/modules/notifications/interfaces/create-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
@Subscriber()
export class DirectMessageSubscriber implements EventSubscriber<DirectMessage> {
  getSubscribedEntities(): EntityName<DirectMessage>[] {
    return [DirectMessage];
  }

  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();
    const cs = changeSets.find(
      (cs) =>
        cs.type === ChangeSetType.CREATE && cs.entity instanceof DirectMessage,
    );

    try {
      if (cs) {
        const { receiver } = cs.entity;

        const notificationPayload: CreateNotificationPayload = {
          alias: NotificationAlias.NEW_MESSAGE,
          subject: NotificationSubject.newMessage,
          content: `de ${cs.entity.sender.username}`,
          jsonData: null,
        };

        const newNotification = new Notification({
          user: receiver,
          ...notificationPayload,
        });

        args.uow.computeChangeSet(newNotification);
        args.uow.recomputeSingleChangeSet(cs.entity);
      }
    } catch (error) {}
  }
}
