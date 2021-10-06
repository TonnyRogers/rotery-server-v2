import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Itinerary } from './itinerary.entity';
import { Lodging } from './lodging.entity';

@Entity()
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

  @PrimaryKey({ type: BigIntType })
  id!: string;

  @ManyToOne(() => Itinerary, { onDelete: 'cascade' })
  itinerary!: Itinerary;

  @ManyToOne(() => Lodging, { onDelete: 'cascade' })
  lodging!: Lodging;

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
