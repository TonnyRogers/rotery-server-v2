import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { Itinerary } from './itinerary.entity';
import { User } from './user.entity';

@Entity()
export class ItineraryQuestion {
  constructor({
    itinerary,
    owner,
    question,
  }: Pick<ItineraryQuestion, 'question' | 'owner' | 'itinerary'>) {
    this.itinerary = itinerary;
    this.owner = owner;
    this.question = question;
  }

  @PrimaryKey({ type: BigIntType })
  id!: string;

  @Property({ nullable: false })
  question!: string;

  @Property({ nullable: true })
  answer: string;

  @Property({ type: 'boolean', default: true })
  isVisible!: boolean;

  @ManyToOne(() => Itinerary, {
    onDelete: 'cascade',
    serializer: (value: Itinerary) => value.id,
  })
  itinerary!: Itinerary;

  @ManyToOne(() => User, {
    onDelete: 'cascade',
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  owner!: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
