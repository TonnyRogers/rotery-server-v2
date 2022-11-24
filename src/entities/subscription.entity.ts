import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { Plan } from './plan.entity';
import { User } from './user.entity';

export enum SubscriptionStatus {
  AUTHORIZED = 'authorized',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  NO_PAYMENT = 'no_payment',
}

@Entity()
export class Subscription {
  constructor({
    referenceId,
    status,
    user,
    applicationId,
  }: Pick<Subscription, 'referenceId' | 'user' | 'status' | 'applicationId'>) {
    this.referenceId = referenceId;
    this.status = status;
    this.user = user;
    this.applicationId = applicationId;
  }

  @PrimaryKey()
  id!: number;

  @Property({ type: 'string' })
  referenceId!: string;

  @Property({ type: 'string' })
  applicationId!: string;

  @ManyToOne(() => Plan, { nullable: true })
  plan?: Plan;

  @ManyToOne(() => User, {
    nullable: false,
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  user!: User;

  @Enum({
    items: () => SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status!: SubscriptionStatus;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date;
}
