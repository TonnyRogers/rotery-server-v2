import {
  Collection,
  Entity,
  Enum,
  JsonType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { File } from './file.entity';
import { ItineraryActivity } from './itinerary-activity.entity';
import { ItineraryLodging } from './itinerary-lodging.entity';
import { ItineraryTransport } from './itinerary-transport.entity';
import { ItineraryPhoto } from './itinerary-photo.entity';

export enum ItineraryStatus {
  ACTIVE = 'active',
  ON_GOING = 'on_going',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity()
export class Itinerary {
  constructor({
    begin,
    capacity,
    deadlineForJoin,
    description,
    end,
    isPrivate,
    location,
    name,
    owner,
    locationJson,
  }: Omit<
    Itinerary,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'activities'
    | 'lodgings'
    | 'photos'
    | 'transports'
  >) {
    this.begin = begin;
    this.capacity = capacity;
    this.deadlineForJoin = deadlineForJoin;
    this.description = description;
    this.end = end;
    this.isPrivate = isPrivate;
    this.location = location;
    this.name = name;
    this.owner = owner;
    this.locationJson = locationJson;
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: false, type: 'string' })
  name!: string;

  @Property({ nullable: false })
  begin!: Date;

  @Property({ nullable: false })
  end!: Date;

  @Property({ nullable: false })
  deadlineForJoin!: Date;

  @Property({ nullable: false, columnType: 'text' })
  description!: string;

  @Property({ nullable: false, type: 'number' })
  capacity!: number;

  @Property({ nullable: false, type: 'string' })
  location!: string;

  @Property({ type: JsonType, nullable: true })
  locationJson?: Record<string, unknown>;

  @Enum({ items: () => ItineraryStatus, default: ItineraryStatus.ACTIVE })
  status: ItineraryStatus;

  @Property({ type: 'boolean', default: false })
  isPrivate: boolean;

  @ManyToOne({ entity: () => User, onDelete: 'cascade' })
  owner!: User;

  @OneToMany(() => ItineraryPhoto, (itineraryPhoto) => itineraryPhoto.itinerary)
  photos = new Collection<ItineraryPhoto>(this);

  @OneToMany(
    () => ItineraryActivity,
    (itineraryActivity) => itineraryActivity.itinerary,
  )
  activities = new Collection<ItineraryActivity>(this);

  @OneToMany(
    () => ItineraryLodging,
    (itineraryLodging) => itineraryLodging.itinerary,
  )
  lodgings = new Collection<ItineraryLodging>(this);

  @OneToMany(
    () => ItineraryTransport,
    (itineraryTransport) => itineraryTransport.itinerary,
  )
  transports = new Collection<ItineraryTransport>(this);

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
