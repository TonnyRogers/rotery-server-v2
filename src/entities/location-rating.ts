import {
  TextType,
  Entity,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { Location } from './location.entity';
import { User } from './user.entity';

@Entity()
export class LocationRating {
  constructor({
    description,
    rate,
    location,
    owner,
  }: Omit<LocationRating, 'id' | 'createdAt' | 'updatedAt'>) {
    this.description = description;
    this.rate = rate;
    this.location = location;
    this.owner = owner;
  }

  @Property({ nullable: false })
  rate!: number;

  @Property({ nullable: true, type: TextType })
  description: string;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => userProfileFileSerializer(value),
  })
  owner!: User;

  @ManyToOne({
    entity: () => Location,
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => value.id,
  })
  location!: Location;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  [PrimaryKeyType]?: [number, number];
}
