import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';

import { Location } from './location.entity';
import { Lodging } from './lodging.entity';

@Entity()
export class LocationLodging {
  constructor({
    location,
    lodging,
    capacity,
    price,
    description,
    isFree,
  }: Omit<LocationLodging, 'id' | 'createdAt' | 'updatedAt'>) {
    this.location = location;
    this.lodging = lodging;
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
