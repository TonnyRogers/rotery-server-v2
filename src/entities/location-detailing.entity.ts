import { Entity, Enum, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from "@mikro-orm/core";
import { Location } from "./location.entity";

enum LocationType {
  DURATION = 'duration',
  MOBILITY_ACCESS = 'mobility_access',
  CHILDREN_ACCESS = 'children_access',
  ANIMAL_PRESENCE = 'animal_presente',
  MOBILE_SIGNAL = 'mobile_signal',
  FOOD_PROXIMITY = 'food_nearby'
}

@Entity()
export class LocationDetailing {
  constructor({
    location,
    text,
    type,
    variant,
    variant_text,
  }: Omit<LocationDetailing, 'createdAt' | 'updatedAt' | 'id'>) {
    this.location = location;
    this.text = text;
    this.type = type;
    this.variant = variant;
    this.variant_text = variant_text;
  }

  @ManyToOne(
    () => Location, { 
      primary: true,
      onDelete: 'cascade', 
      serializer: (value) => value.id 
    })
  location!: Location;

  @Enum({ primary: true, items: () => LocationType, nullable: false })
  type!: LocationType;

  @Property({ nullable: false, type: 'string' })
  text!: string;

  @Property({ nullable: false, type: 'string' })
  variant!: string;

  @Property({ nullable: false, type: 'string' })
  variant_text!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  [PrimaryKeyType]?: [number,string];
}