import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Itinerary } from './itinerary.entity';
import { Transport } from './transport.entity';

@Entity()
export class ItineraryTransport {
  constructor({
    itinerary,
    transport,
    capacity,
    price,
    description,
    isFree,
  }: Omit<ItineraryTransport, 'id' | 'createdAt' | 'updatedAt'>) {
    this.itinerary = itinerary;
    this.transport = transport;
    this.capacity = capacity;
    this.price = price;
    this.description = description;
    this.isFree = isFree;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Itinerary, { onDelete: 'cascade' })
  itinerary!: Itinerary;

  @ManyToOne(() => Transport, { onDelete: 'cascade' })
  transport!: Transport;

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
