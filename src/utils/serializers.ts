import { ItineraryActivity } from '@/entities/itinerary-activity.entity';
import { ItineraryLodging } from '@/entities/itinerary-lodging.entity';
import { ItineraryTransport } from '@/entities/itinerary-transport.entity';
import { Itinerary } from '@/entities/itinerary.entity';
import { User } from '@/entities/user.entity';
import { Collection, EntityDTO } from '@mikro-orm/core';

export const userProfileFileSerializer = (value: User) => ({
    id: value.id,
    username: value.username,
    profile: {
      file: {
        url: value.profile?.file?.url,
      },
    }
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
    profile: {
      file: {
        url: value.owner.profile.file.url,
      }
    },
    createdAt: value.owner.createdAt,
  }
}); 

export const itineraryActivityCollectionSerializer = (value: Collection<ItineraryActivity>) => value
  .toArray()
  .map(({ capacity,price,description,isFree, itinerary, activity }: EntityDTO<ItineraryActivity>) => ({
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
  }));

export const itineraryTransportCollectionSerializer = (value: Collection<ItineraryTransport>) => value
  .toArray()
  .map(({ capacity,price,description,isFree, itinerary, transport }: EntityDTO<ItineraryTransport>) => ({
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
  }));

export const itineraryLodgingCollectionSerializer = (value: Collection<ItineraryLodging>) => value
  .toArray()
  .map(({ capacity,price,description,isFree, itinerary, lodging }: EntityDTO<ItineraryLodging>) => ({
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
  }));
