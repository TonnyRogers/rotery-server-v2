import {
  LocationDetailing,
  LocationDetailingType,
} from '@/entities/location-detailing.entity';
import { fakeLocations } from '@/modules/locations/fakes/locations-repository.fake';

export const fakeLocationDetailings: LocationDetailing[] = [
  {
    location: fakeLocations[0],
    createdAt: new Date(),
    updatedAt: new Date(),
    text: 'fake location detailing',
    type: LocationDetailingType.ANIMAL_PRESENCE,
    variant: '',
    variantText: '',
  },
];
