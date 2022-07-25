import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';

import { Location } from './location.entity';

export enum LocationDetailingType {
  DURATION = 'duration',
  MOBILITY_ACCESS = 'mobility_access',
  CHILDREN_ACCESS = 'children_access',
  ANIMAL_PRESENCE = 'animal_presente',
  MOBILE_SIGNAL = 'mobile_signal',
  FOOD_PROXIMITY = 'food_nearby',
}

@Entity()
export class LocationDetailing {
  constructor({
    location,
    text,
    type,
    variant,
    variantText,
  }: Omit<LocationDetailing, 'createdAt' | 'updatedAt' | 'id'>) {
    this.location = location;
    this.text = text;
    this.type = type;
    this.variant = variant;
    this.variantText = variantText;
  }

  @ManyToOne(() => Location, {
    primary: true,
    onDelete: 'cascade',
    serializer: (value) => value.id,
  })
  location!: Location;

  @Enum({ primary: true, items: () => LocationDetailingType, nullable: false })
  type!: LocationDetailingType;

  @Property({ nullable: false, type: 'string' })
  text!: string;

  @Property({ nullable: true, type: 'string' })
  variant?: string;

  @Property({ nullable: true, type: 'string' })
  variantText?: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  [PrimaryKeyType]?: [number, string];
}
