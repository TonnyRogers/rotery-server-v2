import { EntityData, FilterQuery } from '@mikro-orm/core';

import { GetLocationQueryFilter } from './service-interface';

import { Location } from '@/entities/location.entity';
import { PaginatedResponse } from '@/utils/types';

import { GetLocationFeedQueryFilter } from '../dto/get-feed-query-filter.dto';

export interface FindOneLocationRepositoryFilter {
  id?: number;
  name?: string;
  location?: string;
  alias?: string;
}

export interface LocationsRepositoryInterface {
  findAll(filters: GetLocationQueryFilter): Promise<Location[] | null>;
  findOne(filters: FindOneLocationRepositoryFilter): Promise<Location | null>;
  create(entity: Location): Promise<Location>;
  update(entity: Partial<Location>, id: number): Promise<Location>;
  delete(id: number): Promise<void>;
  findAsFeed(
    filters: GetLocationFeedQueryFilter,
  ): Promise<PaginatedResponse<Location>>;
  findFeedFilters(
    filters: GetLocationFeedQueryFilter,
  ): Promise<
    { activity_id: number; activity_name: string; activity_icon: string }[]
  >;
}

export interface LocationBaseRelatedRepositoryInterface<T> {
  insertJoinTable(
    data: EntityData<T>[],
    deleteWhere?: FilterQuery<T>,
  ): Promise<void>;
}
