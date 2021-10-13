import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Itinerary } from './itinerary.entity';

@Entity()
export class ItineraryRating {
  constructor({
    description,
    rate,
    itinerary,
  }: Omit<ItineraryRating, 'id' | 'createdAt' | 'updatedAt'>) {
    this.description = description;
    this.rate = rate;
    this.itinerary = itinerary;
  }
  @PrimaryKey({ type: BigIntType })
  id!: string;

  @Property({ nullable: false })
  rate!: number;

  @Property({ nullable: true })
  description: string;

  @ManyToOne({ entity: () => Itinerary, onDelete: 'cascade' })
  itinerary!: Itinerary;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
