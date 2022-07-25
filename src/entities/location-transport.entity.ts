import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';

import { Location } from './location.entity';
import { Transport } from './transport.entity';

@Entity()
export class LocationTransport {
  constructor({
    location,
    transport,
    capacity,
    price,
    description,
    isFree,
  }: Omit<LocationTransport, 'id' | 'createdAt' | 'updatedAt'>) {
    this.location = location;
    this.transport = transport;
    this.capacity = capacity;
    this.price = price;
    this.description = description;
    this.isFree = isFree;
  }

  @ManyToOne(() => Location, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => value.id,
  })
  location!: Location;

  @ManyToOne(() => Transport, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value: Transport) => ({
      id: value.id,
      name: value.name,
      alias: value.alias,
    }),
  })
  transport!: Transport;

  @Property({ type: 'number', nullable: true })
  capacity: number;

  @Property({ columnType: 'decimal(8,2)', nullable: true })
  price: string;

  @Property({ type: 'string', nullable: true })
  description!: string;

  @Property({ type: 'boolean', default: false })
  isFree!: boolean;

  [PrimaryKeyType]?: [number, number];
}
