import { GetLocationFeedQueryFilter } from '@/modules/locations/dto/get-feed-query-filter.dto';

export interface FiltersServiceInterface {
  locationFeedFilters(params: GetLocationFeedQueryFilter): Promise<any>;
}
