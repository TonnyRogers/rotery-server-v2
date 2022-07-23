import { Entity, Enum, JsonType, PrimaryKey, Property } from "@mikro-orm/core";

export enum LocationType {
  BEACH = 'beach',
  WATERFALL = 'waterfall',
  CAVERN = 'cavern',
  MOUNTAIN = 'mountain',
  PARK = 'park',
  PLACE = 'place',
}

@Entity()
export class Location {
  constructor({
    name,
    description,
    location,
    locationJson,
    alias,
    type,
  }: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) {
    this.name = name;
    this.description = description;
    this.location = location;
    this.locationJson = locationJson;
    this.alias = alias;
    this.type = type;
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: false, type: 'string' })
  name!: string;

  @Property({ nullable: false, type: 'string' })
  description!: string;

  @Property({ nullable: false, type: 'string' })
  location!: string;

  @Property({ type: JsonType, nullable: true })
  locationJson?: Record<string, unknown>;

  @Property({ nullable: false, type: 'string' })
  alias!: string;

  @Enum({ items: () => LocationType, default: LocationType.PLACE  })
  type!: LocationType;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}