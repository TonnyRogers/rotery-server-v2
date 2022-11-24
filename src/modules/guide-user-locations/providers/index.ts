import { Provider } from '@nestjs/common';

import { GuideUserLocationsService } from '../guide-user-locations.service';

import { GuideUserLocationsProvider } from '../enums/guide-user-locations-provider';
import { GuideUserLocationsRepository } from '../guide-user-locations.repository';

export const guideUserLocationsProviders: Provider[] = [
  {
    provide: GuideUserLocationsProvider.GUIDE_USER_LOCATIONS_SERVICE,
    useClass: GuideUserLocationsService,
  },
  {
    provide: GuideUserLocationsProvider.GUIDE_USER_LOCATIONS_REPOSITORY,
    useClass: GuideUserLocationsRepository,
  },
];
