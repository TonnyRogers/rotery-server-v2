import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Itinerary } from './itinerary.entity';
import { User } from './user.entity';

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

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date;
}
