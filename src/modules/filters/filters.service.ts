import { Inject, Injectable } from '@nestjs/common';

import { FiltersServiceInterface } from './interfaces/filters-service.interface';

import { LocationType } from '@/entities/location.entity';

import { GetLocationFeedQueryFilter } from '../locations/dto/get-feed-query-filter.dto';
import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { LocationsRepositoryInterface } from '../locations/interfaces/repository-interface';

@Injectable()
export class FiltersService implements FiltersServiceInterface {
  constructor(
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationsRepository: LocationsRepositoryInterface,
  ) {}

  async locationFeedFilters(params: GetLocationFeedQueryFilter): Promise<any> {
    const feedFilters = await this.locationsRepository.findFeedFilters(params);

    const activities = [];

    feedFilters.forEach(
      (filterItem) =>
        filterItem.activity_id &&
        activities.push({
          id: filterItem.activity_id,
          name: filterItem.activity_name,
          icon: filterItem.activity_icon,
        }),
    );

    const tranlateLocationType = {
      [LocationType.BEACH]: 'Praia',
      [LocationType.CAVERN]: 'Caverna/Gruta',
      [LocationType.MOUNTAIN]: 'Montanha',
      [LocationType.PARK]: 'Parque',
      [LocationType.PLACE]: 'Local',
      [LocationType.WATERFALL]: 'Cachoeira',
    };

    const locationTypes = Object.values(LocationType);
    const formatedLocationTypes = locationTypes.reduce((acc, curr) => {
      acc.push({
        name: tranlateLocationType[curr],
        id: curr,
      });
      return acc;
    }, []);

    return {
      activities,
      locationTypes: formatedLocationTypes,
    };
  }
}
