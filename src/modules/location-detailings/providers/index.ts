import { Provider } from '@nestjs/common';

import { LocationDetailingService } from '../location-detailings.service';

import { LocationDetailingsProvider } from '../enums/location-detailings-provider.enum';
import { LocationDetailingRepository } from '../location-detailings.repository';

export const locationDetailingProvider: Provider[] = [
  {
    provide: LocationDetailingsProvider.LOCATION_DETAILING_SERVICE,
    useClass: LocationDetailingService,
  },
  {
    provide: LocationDetailingsProvider.LOCATION_DETAILING_REPOSITORY,
    useClass: LocationDetailingRepository,
  },
];
