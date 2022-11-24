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
  GUIDE_REQUESTED = 'guide_requested',
  WEEKLY_PRESENCE = 'weekly_presence',
}

export enum LocationDetailingLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity()
export class LocationDetailing {
  constructor({
    location,
    type,
    level,
    measure,
    quantity,
    validation,
    text,
  }: Omit<LocationDetailing, 'createdAt' | 'updatedAt' | 'id'>) {
    this.location = location;
    this.type = type;
    this.level = level;
    this.measure = measure;
    this.quantity = quantity;
    this.validation = validation;
    this.text = text;
  }

  @ManyToOne(() => Location, {
    primary: true,
    onDelete: 'cascade',
    serializer: (value) => value.id,
  })
  location!: Location;

  @Enum({ primary: true, items: () => LocationDetailingType, nullable: false })
  type!: LocationDetailingType;

  @Property({ nullable: true })
  quantity?: number;

  @Property({ nullable: true, type: 'string' })
  measure?: string;

  @Enum({
    items: () => LocationDetailingLevel,
    nullable: true,
  })
  level?: LocationDetailingLevel;

  @Property({ nullable: true })
  validation?: boolean;

  @Property({ nullable: false, type: 'string' })
  text!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  [PrimaryKeyType]?: [number, string];
}
