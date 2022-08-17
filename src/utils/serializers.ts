import { Collection, EntityDTO } from '@mikro-orm/core';

import { ItineraryActivity } from '@/entities/itinerary-activity.entity';
import { ItineraryLodging } from '@/entities/itinerary-lodging.entity';
import { ItineraryTransport } from '@/entities/itinerary-transport.entity';
import { Itinerary } from '@/entities/itinerary.entity';
import { LocationActivity } from '@/entities/location-activity.entity';
import { LocationDetailing } from '@/entities/location-detailing.entity';
import { LocationLodging } from '@/entities/location-lodging.entity';
import { LocationTransport } from '@/entities/location-transport.entity';
import { User } from '@/entities/user.entity';

export const userProfileFileSerializer = (value: User) => ({
  id: value.id,
  username: value.username,
  ratingAvg: value.ratingAvg,
  profile: {
    file: {
      url: value.profile?.file?.url,
    },
  },
});

export const itineraryOwnerFileSerializer = (value: Itinerary) => ({
  id: value.id,
  name: value.name,
  begin: value.begin,
  end: value.end,
  location: value.location,
  owner: {
    id: value.owner.id,
    username: value.owner.username,
    ratingAvg: value.owner.ratingAvg,
    profile: {
      file: {
        url: value.owner.profile.file.url,
      },
    },
    createdAt: value.owner.createdAt,
  },
});

export const itineraryActivityCollectionSerializer = (
  value: Collection<ItineraryActivity>,
) =>
  value
    .toArray()
    .map(
      ({
        capacity,
        price,
        description,
        isFree,
        itinerary,
        activity,
      }: EntityDTO<ItineraryActivity>) => ({
        itinerary,
        activity: {
          id: activity.id,
          name: activity.name,
          alias: activity.alias,
        },
        capacity,
        price,
        description,
        isFree,
      }),
    );

export const itineraryTransportCollectionSerializer = (
  value: Collection<ItineraryTransport>,
) =>
  value
    .toArray()
    .map(
      ({
        capacity,
        price,
        description,
        isFree,
        itinerary,
        transport,
      }: EntityDTO<ItineraryTransport>) => ({
        itinerary,
        transport: {
          id: transport.id,
          name: transport.name,
          alias: transport.alias,
        },
        capacity,
        price,
        description,
        isFree,
      }),
    );

export const itineraryLodgingCollectionSerializer = (
  value: Collection<ItineraryLodging>,
) =>
  value
    .toArray()
    .map(
      ({
        capacity,
        price,
        description,
        isFree,
        itinerary,
        lodging,
      }: EntityDTO<ItineraryLodging>) => ({
        itinerary,
        lodging: {
          id: lodging.id,
          name: lodging.name,
          alias: lodging.alias,
        },
        capacity,
        price,
        description,
        isFree,
      }),
    );

export const locationActivityCollectionSerializer = (
  value: Collection<LocationActivity>,
) =>
  value
    .toArray()
    .map(
      ({
        price,
        description,
        isFree,
        location,
        activity,
      }: EntityDTO<LocationActivity>) => ({
        location,
        activity: {
          id: activity.id,
          name: activity.name,
          alias: activity.alias,
        },
        price,
        description,
        isFree,
      }),
    );

export const locationTransportCollectionSerializer = (
  value: Collection<LocationTransport>,
) =>
  value
    .toArray()
    .map(
      ({
        price,
        description,
        isFree,
        location,
        transport,
      }: EntityDTO<LocationTransport>) => ({
        location,
        transport: {
          id: transport.id,
          name: transport.name,
          alias: transport.alias,
        },
        price,
        description,
        isFree,
      }),
    );

export const locationLodgingCollectionSerializer = (
  value: Collection<LocationLodging>,
) =>
  value
    .toArray()
    .map(
      ({
        price,
        description,
        isFree,
        location,
        lodging,
      }: EntityDTO<LocationLodging>) => ({
        location,
        lodging: {
          id: lodging.id,
          name: lodging.name,
          alias: lodging.alias,
        },
        price,
        description,
        isFree,
      }),
    );

export const locationDetailingCollectionSerializer = (
  value: Collection<LocationDetailing>,
) =>
  value
    .toArray()
    .map(
      ({
        location,
        text,
        type,
        level,
        measure,
        quantity,
        validation,
      }: EntityDTO<LocationDetailing>) => ({
        location: location.id,
        text,
        type,
        level,
        measure,
        quantity,
        validation,
      }),
    );
