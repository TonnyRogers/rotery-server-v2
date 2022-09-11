import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';

import { ItineraryLodgingRepository } from '@/modules/itineraries/repositories/itinerary-lodging.repository';

import { Itinerary } from './itinerary.entity';
import { Lodging } from './lodging.entity';

@Entity({ customRepository: () => ItineraryLodgingRepository })
export class ItineraryLodging {
  constructor({
    itinerary,
    lodging,
    capacity,
    price,
    description,
    isFree,
  }: Omit<ItineraryLodging, 'id' | 'createdAt' | 'updatedAt'>) {
    this.itinerary = itinerary;
    this.lodging = lodging;
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

  @ManyToOne(() => Lodging, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value: Lodging) => ({
      id: value.id,
      name: value.name,
      alias: value.alias,
    }),
  })
  lodging!: Lodging;

  @Property({ type: 'number', nullable: false })
  capacity: number;

  @Property({ columnType: 'decimal(8,2)', nullable: true })
  price: string;

  @Property({ type: 'string', nullable: false })
  description!: string;

  @Property({ type: 'boolean', default: false })
  isFree!: boolean;

  [PrimaryKeyType]?: [number, number];
  [EntityRepositoryType]?: ItineraryLodgingRepository;
}
