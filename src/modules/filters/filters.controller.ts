import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';

import { FiltersServiceInterface } from './interfaces/filters-service.interface';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetLocationFeedQueryFilter } from '../locations/dto/get-feed-query-filter.dto';
import { FiltersProvider } from './enums/filters-providers.enum';

@Controller('filters')
export class FiltersController {
  constructor(
    @Inject(FiltersProvider.FILTERS_SERVICE)
    private readonly filtersService: FiltersServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('location-feed')
  async getLocationFeedFilters(
    @Query() feedFilters: GetLocationFeedQueryFilter,
  ) {
    return this.filtersService.locationFeedFilters(feedFilters);
  }
}
