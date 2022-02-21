import {
  BigIntType,
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Itinerary } from './itinerary.entity';
import { User } from './user.entity';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  REFUNDED = 'refunded',
  REFUSED = 'refused',
  FREE = 'free',
}

@Entity()
export class ItineraryMember {
  constructor({
    itinerary,
    user,
  }: Pick<ItineraryMember, 'itinerary' | 'user'>) {
    this.itinerary = itinerary;
    this.user = user;
  }

  @PrimaryKey({ type: BigIntType })
  id!: string;

  @Property({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @Property({ type: 'boolean', default: false })
  isAccepted!: boolean;

  @ManyToOne(() => Itinerary, { onDelete: 'cascade' })
  itinerary!: Itinerary;

  @ManyToOne(() => User, { onDelete: 'cascade' })
  user!: User;

  @Property({ type: 'string', nullable: true, lazy: true })
  paymentId: string;

  @Enum({ items: () => PaymentStatus, default: PaymentStatus.FREE })
  paymentStatus: PaymentStatus;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date;
}
