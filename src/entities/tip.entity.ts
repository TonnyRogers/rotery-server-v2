import {
  BigIntType,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { User } from './user.entity';

export enum TipPaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  REFUSED = 'refused',
}

@Entity()
export class Tip {
  constructor({
    payer,
    paymentAmount,
    paymentId,
    paymentStatus,
    user,
  }: Omit<Tip, 'createdAt' | 'updatedAt' | 'id' | 'paidAt'>) {
    this.payer = payer;
    this.paymentAmount = paymentAmount;
    this.paymentId = paymentId;
    this.paymentStatus = paymentStatus;
    this.user = user;
  }

  @PrimaryKey({ type: BigIntType })
  id!: string;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    serializer: (value) => userProfileFileSerializer(value),
  })
  payer!: User;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    serializer: (value) => userProfileFileSerializer(value),
  })
  user!: User;

  @Property({ type: 'string', nullable: true, lazy: true })
  paymentId: string;

  @Enum({ items: () => TipPaymentStatus, default: TipPaymentStatus.PENDING })
  paymentStatus: TipPaymentStatus;

  @Property({ columnType: 'decimal(8,2)', nullable: true, lazy: true })
  paymentAmount: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  paidAt: Date;
}
