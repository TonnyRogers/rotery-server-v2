import { Provider } from '@nestjs/common';

import { UserRatingsService } from '../user-ratings.service';

import { UserRatingsProvider } from '../enums/user-ratings-providers.enum';
import { UserRatingsRepository } from '../user-ratings.repository';

export const userRatingsProvider: Provider[] = [
  {
    provide: UserRatingsProvider.USER_RATINGS_SERVICE,
    useClass: UserRatingsService,
  },
  {
    provide: UserRatingsProvider.USER_RATINGS_REPOSITORY,
    useClass: UserRatingsRepository,
  },
];
