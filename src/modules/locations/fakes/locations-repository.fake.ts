import { Location, LocationType } from '@/entities/location.entity';

export const fakeLocations: Location[] = [
  {
    id: 1,
    alias: 'fake-location-name-fake-location',
    createdAt: new Date(),
    description: 'fake description',
    location: 'fake location',
    name: 'fake location name',
    type: LocationType.PLACE,
    updatedAt: new Date(),
    locationJson: undefined,
    detailings: undefined,
    activities: undefined,
    lodgings: undefined,
    photos: undefined,
    transports: undefined,
  },
];
