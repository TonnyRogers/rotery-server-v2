import { ItineraryTransportRepository } from '@/modules/itineraries/repositories/itinerary-transport.repository';
import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { Itinerary } from './itinerary.entity';
import { Transport } from './transport.entity';

@Entity({ customRepository: () => ItineraryTransportRepository })
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

  @ManyToOne(
    () => Itinerary, { 
      onDelete: 'cascade' , 
      primary: true, 
      serializer: (value) => value.id
    })
  itinerary!: Itinerary;

  @ManyToOne(
    () => Transport, { 
      onDelete: 'cascade' , 
      primary: true, 
      serializer: (value: Transport) => ({ 
        id: value.id, 
        name: value.name,
        alias: value.alias,
      })
    })
  transport!: Transport;

  @Property({ type: 'number', nullable: false })
  capacity: number;

  @Property({ columnType: 'decimal(8,2)', nullable: true })
  price: string;

  @Property({ type: 'string', nullable: false })
  description!: string;

  @Property({ type: 'boolean', default: false })
  isFree!: boolean;

  [PrimaryKeyType]?: [number,number];
  [EntityRepositoryType]?: ItineraryTransportRepository;
}
