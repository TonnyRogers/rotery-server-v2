import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  JsonType,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { ItineraryRepository } from '@/modules/itineraries/repositories/itineraries.repository';
import {
  itineraryActivityCollectionSerializer,
  itineraryLodgingCollectionSerializer,
  itineraryTransportCollectionSerializer,
  userProfileFileSerializer,
} from '@/utils/serializers';

import { ItineraryActivity } from './itinerary-activity.entity';
import { ItineraryLodging } from './itinerary-lodging.entity';
import { ItineraryMember } from './itinerary-member.entity';
import { ItineraryPhoto } from './itinerary-photo.entity';
import { ItineraryQuestion } from './itinerary-question.entity';
import { ItineraryTransport } from './itinerary-transport.entity';
import { User } from './user.entity';

export enum ItineraryStatus {
  ACTIVE = 'active',
  ON_GOING = 'on_going',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity({ customRepository: () => ItineraryRepository })
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
    requestPayment,
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
    | 'questions'
    | 'members'
    | 'deletedAt'
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
    this.requestPayment = requestPayment;
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

  @Property({ type: 'boolean', default: false })
  requestPayment!: boolean;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  owner!: User;

  @OneToMany(() => ItineraryPhoto, (itineraryPhoto) => itineraryPhoto.itinerary)
  photos = new Collection<ItineraryPhoto>(this);

  @OneToMany(
    () => ItineraryActivity,
    (itineraryActivity) => itineraryActivity.itinerary,
    {
      serializer: (value: Collection<ItineraryActivity>) =>
        itineraryActivityCollectionSerializer(value),
    },
  )
  activities = new Collection<ItineraryActivity>(this);

  @OneToMany(
    () => ItineraryLodging,
    (itineraryLodging) => itineraryLodging.itinerary,
    {
      serializer: (value: Collection<ItineraryLodging>) =>
        itineraryLodgingCollectionSerializer(value),
    },
  )
  lodgings = new Collection<ItineraryLodging>(this);

  @OneToMany(
    () => ItineraryTransport,
    (itineraryTransport) => itineraryTransport.itinerary,
    {
      serializer: (value: Collection<ItineraryTransport>) =>
        itineraryTransportCollectionSerializer(value),
    },
  )
  transports = new Collection<ItineraryTransport>(this);

  @OneToMany(
    () => ItineraryQuestion,
    (itineraryQuestion) => itineraryQuestion.itinerary,
  )
  questions = new Collection<ItineraryQuestion>(this);

  @OneToMany(
    () => ItineraryMember,
    (itineraryMember) => itineraryMember.itinerary,
  )
  members = new Collection<ItineraryMember>(this);

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date;

  // toJSON(strict = true, strip = ['itinerary'], ...args: any): { [ p: string]: any } {
  //   const o = wrap(this,true).toObject(...args);

  //   if(strict) {
  //     strip.forEach(k => delete o[k]);
  //   }

  //   return o;
  // }

  [EntityRepositoryType]?: ItineraryRepository;
}
