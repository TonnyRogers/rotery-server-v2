import {
  EntityName,
  EventArgs,
  EventSubscriber,
  Subscriber,
} from '@mikro-orm/core';

import { UserRecoverPassWordMailTemplateParams } from '@/resources/emails/types/user-recover-password';

import { ResetPassword } from '../entities/reset-password.entity';
import {
  RabbitMailPublisherParams,
  RabbitMailPublisher,
} from '../providers/rabbit-publisher';

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

    const payload: RabbitMailPublisherParams<UserRecoverPassWordMailTemplateParams> =
      {
        data: {
          to: email,
          type: 'user-recover-password',
          payload: {
            name: username,
            resetcode: Number(args.entity.code),
          },
        },
      };

    const rmqPublish = new RabbitMailPublisher();

    await rmqPublish.toQueue(payload);
  }
}
