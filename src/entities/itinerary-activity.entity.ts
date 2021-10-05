import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Activity } from './activity.entity';
import { Itinerary } from './itinerary.entity';

@Entity()
export class ItineraryActivity {
  constructor({
    itinerary,
    activity,
    capacity,
    price,
    description,
    isFree,
  }: Omit<ItineraryActivity, 'id' | 'createdAt' | 'updatedAt'>) {
    this.itinerary = itinerary;
    this.activity = activity;
    this.capacity = capacity;
    this.price = price;
    this.description = description;
    this.isFree = isFree;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Itinerary, { onDelete: 'cascade' })
  itinerary!: Itinerary;

  @ManyToOne(() => Activity, { onDelete: 'cascade' })
  activity!: Activity;

  @Property({ type: 'number', nullable: false })
  capacity: number;

  @Property({ columnType: 'decimal(8,2)', nullable: true })
  price: string;

  @Property({ type: 'string', nullable: false })
  description!: string;

  @Property({ type: 'boolean', default: false })
  isFree!: boolean;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
