import { Provider } from '@nestjs/common';

import { FiltersService } from '../filters.service';

import { FiltersProvider } from '../enums/filters-providers.enum';

export const filterProvider: Provider[] = [
  {
    provide: FiltersProvider.FILTERS_SERVICE,
    useClass: FiltersService,
  },
];
