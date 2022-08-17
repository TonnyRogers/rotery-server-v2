import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';

import { Activity } from './activity.entity';
import { Location } from './location.entity';

@Entity()
export class LocationActivity {
  constructor({
    location,
    activity,
    price,
    description,
    isFree,
  }: Omit<LocationActivity, 'id' | 'createdAt' | 'updatedAt'>) {
    this.location = location;
    this.activity = activity;
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

  @Property({ nullable: true })
  price: string;

  @Property({ type: 'string', nullable: true })
  description!: string;

  @Property({ type: 'boolean', default: false })
  isFree!: boolean;

  [PrimaryKeyType]?: [number, number];
}
