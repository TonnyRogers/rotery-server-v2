import {
  Collection,
  Entity,
  Enum,
  JsonType,
  OneToMany,
  PrimaryKey,
  Property,
  TextType,
} from '@mikro-orm/core';

import {
  locationActivityCollectionSerializer,
  locationDetailingCollectionSerializer,
  locationLodgingCollectionSerializer,
  locationTransportCollectionSerializer,
} from '@/utils/serializers';

import { GuideUserLocation } from './guide-user-location.entity';
import { LocationActivity } from './location-activity.entity';
import { LocationDetailing } from './location-detailing.entity';
import { LocationLodging } from './location-lodging.entity';
import { LocationPhoto } from './location-photo.entity';
import { LocationRating } from './location-rating';
import { LocationTransport } from './location-transport.entity';

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
  }: Pick<
    Location,
    'name' | 'description' | 'location' | 'locationJson' | 'alias' | 'type'
  >) {
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

  @Property({ nullable: false, type: TextType })
  description: string;

  @Property({ nullable: false, type: 'string' })
  location!: string;

  @Property({ type: JsonType, nullable: true })
  locationJson?: Record<string, unknown>;

  @Property({ nullable: false, type: 'string' })
  alias!: string;

  @Enum({ items: () => LocationType, default: LocationType.PLACE })
  type!: LocationType;

  @OneToMany(
    () => LocationDetailing,
    (locationDetailing) => locationDetailing.location,
    {
      serializer: (value: Collection<LocationDetailing>) =>
        locationDetailingCollectionSerializer(value),
      nullable: true,
    },
  )
  detailings = new Collection<LocationDetailing>(this);

  @OneToMany(
    () => LocationTransport,
    (locationTransport) => locationTransport.location,
    {
      serializer: (value: Collection<LocationTransport>) =>
        locationTransportCollectionSerializer(value),
      nullable: true,
    },
  )
  transports = new Collection<LocationTransport>(this);

  @OneToMany(
    () => LocationActivity,
    (locationActivity) => locationActivity.location,
    {
      serializer: (value: Collection<LocationActivity>) =>
        locationActivityCollectionSerializer(value),
      nullable: true,
    },
  )
  activities = new Collection<LocationActivity>(this);

  @OneToMany(
    () => LocationLodging,
    (locationLodging) => locationLodging.location,
    {
      serializer: (value: Collection<LocationLodging>) =>
        locationLodgingCollectionSerializer(value),
      nullable: true,
    },
  )
  lodgings = new Collection<LocationLodging>(this);

  @OneToMany(
    () => LocationRating,
    (locationRating) => locationRating.location,
    {
      nullable: true,
    },
  )
  ratings = new Collection<LocationRating>(this);

  @OneToMany(() => LocationPhoto, (locationPhoto) => locationPhoto.location)
  photos = new Collection<LocationPhoto>(this);

  @OneToMany(() => GuideUserLocation, (guideUser) => guideUser.location)
  guides = new Collection<GuideUserLocation>(this);

  @Property({ persist: false })
  get ratingAvg() {
    if (this.ratings?.isInitialized()) {
      let totalRatings = 0;
      let ratingCount = 0;

      this.ratings.getItems().forEach((rating) => {
        totalRatings += rating.rate;
        ratingCount++;
      });

      return totalRatings / ratingCount;
    }
  }

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
