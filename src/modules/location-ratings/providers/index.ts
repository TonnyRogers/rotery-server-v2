import { Provider } from '@nestjs/common';

import { LocationRatingsService } from '../location-ratings.service';

import { LocationRatingsProvider } from '../enums/location-ratings-provider.enum';
import { LocationRatingsRepository } from '../location-ratings.repository';

export const locationRatingsProvider: Provider[] = [
  {
    provide: LocationRatingsProvider.LOCATION_RATINGS_SERVICE,
    useClass: LocationRatingsService,
  },
  {
    provide: LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY,
    useClass: LocationRatingsRepository,
  },
];
