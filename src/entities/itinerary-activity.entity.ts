import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';

import { ItineraryActivityRepository } from '@/modules/itineraries/repositories/itinerary-activity.repository';

import { Activity } from './activity.entity';
import { Itinerary } from './itinerary.entity';

@Entity({ customRepository: () => ItineraryActivityRepository })
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

  @ManyToOne(() => Itinerary, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => value.id,
  })
  itinerary!: Itinerary;

  @ManyToOne(() => Activity, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value: Activity) => ({
      id: value.id,
      name: value.name,
      alias: value.alias,
    }),
  })
  activity!: Activity;

  @Property({ type: 'number', nullable: false })
  capacity: number;

  @Property({ columnType: 'decimal(8,2)', nullable: true })
  price: string;

  @Property({ type: 'string', nullable: false })
  description!: string;

  @Property({ type: 'boolean', default: false })
  isFree!: boolean;

  [PrimaryKeyType]?: [number, number];
  [EntityRepositoryType]?: ItineraryActivityRepository;
}
