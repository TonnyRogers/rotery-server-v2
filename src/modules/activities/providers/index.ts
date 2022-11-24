import { Provider } from '@nestjs/common';

import { ActivitiesService } from '../activities.service';

import { ActivitiesRepository } from '../activities.repository';
import { ActivitiesProviders } from '../enums/activities-provider.enum';

export const activitiesProvider: Provider[] = [
  {
    provide: ActivitiesProviders.ACTIVITIES_REPOSITORY,
    useClass: ActivitiesRepository,
  },
  {
    provide: ActivitiesProviders.ACTIVITIES_SERVICE,
    useClass: ActivitiesService,
  },
];
