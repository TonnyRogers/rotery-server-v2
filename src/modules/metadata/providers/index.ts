import { Provider } from '@nestjs/common';

import { MetadataService } from '../metadata.service';

import { LocationRatingsProvider } from '@/modules/location-ratings/enums/location-ratings-provider.enum';
import { LocationRatingsRepository } from '@/modules/location-ratings/location-ratings.repository';
import { UserRatingsProvider } from '@/modules/user-ratings/enums/user-ratings-providers.enum';
import { UserRatingsRepository } from '@/modules/user-ratings/user-ratings.repository';

import { MetadataProvider } from '../enums/metadata-providers.enum';

export const metadataProvider: Provider[] = [
  {
    provide: MetadataProvider.METADATA_SERVICE,
    useClass: MetadataService,
  },
  {
    provide: LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY,
    useClass: LocationRatingsRepository,
  },
  {
    provide: UserRatingsProvider.USER_RATINGS_REPOSITORY,
    useClass: UserRatingsRepository,
  },
];
