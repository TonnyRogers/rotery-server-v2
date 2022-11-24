import { LocationRating } from '@/entities/location-rating';
import { fakeLocations } from '@/modules/locations/fakes/locations-repository.fake';
import { fakeUsers } from '@/modules/users/fakes/user.fake';

export const fakeLocationRatings: LocationRating[] = [
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'fake description',
    location: fakeLocations[0],
    owner: fakeUsers[0],
    rate: 5,
  },
];
