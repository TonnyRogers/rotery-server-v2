import {
  EntityName,
  EventArgs,
  EventSubscriber,
  Subscriber,
} from '@mikro-orm/core';

import { EmailTypes } from '@/utils/constants';

import { ResetPassword } from '../entities/reset-password.entity';
import { RabbitMQPublisher } from '../providers/rabbit-publisher';

@Subscriber()
export class ResetPasswordSubscriber implements EventSubscriber<ResetPassword> {
  getSubscribedEntities(): EntityName<ResetPassword>[] {
    return [ResetPassword];
  }

  async afterCreate(args: EventArgs<ResetPassword>): Promise<void> {
    const resetEntity = await args.em.findOne(
      ResetPassword,
      { id: args.entity.id },
      { populate: ['user', 'user.email'] },
    );

    const { username, email } = resetEntity.user;

    const payload = {
      data: {
        type: EmailTypes.recover,
        payload: {
          name: username,
          email,
          resetcode: args.entity.code,
        },
      },
    };

    const rmqPublish = new RabbitMQPublisher();

    await rmqPublish.toQueue(payload);
  }
}
