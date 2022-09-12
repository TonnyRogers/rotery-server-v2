import {
  AfterCreate,
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UserRecoverPassWordMailTemplateParams } from '@/resources/emails/types/user-recover-password';

import {
  RabbitMailPublisherParams,
  RabbitMailPublisher,
} from '../providers/rabbit-publisher';
import { User } from './user.entity';

@Entity()
export class ResetPassword {
  constructor({
    code,
    dateLimit,
    user,
  }: Pick<ResetPassword, 'code' | 'dateLimit' | 'user'>) {
    this.code = code;
    this.dateLimit = dateLimit;
    this.user = user;
  }

  @PrimaryKey()
  id!: number;

  @Property({ type: 'string', nullable: false })
  code!: string;

  @OneToOne({ entity: () => User })
  user!: User;

  @Property({ nullable: false })
  dateLimit!: Date;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @AfterCreate()
  async afterCreate() {
    const { username } = this.user;

    const payload: RabbitMailPublisherParams<UserRecoverPassWordMailTemplateParams> =
      {
        data: {
          to: this.user.email,
          type: 'user-recover-password',
          payload: {
            name: username,
            resetcode: Number(this.code),
          },
        },
      };

    const rmqPublish = new RabbitMailPublisher();

    await rmqPublish.toQueue(payload);
  }
}
