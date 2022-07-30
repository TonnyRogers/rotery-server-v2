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
  update(entity: Location): Promise<Location>;
  delete(id: number): Promise<void>;
  findAsFeed(
    filters: GetLocationFeedQueryFilter,
  ): Promise<PaginatedResponse<Location>>;
}

export interface LocationBaseRelatedRepositoryInterface<T> {
  insertJoinTable(
    data: EntityData<T>[],
    deleteWhere?: FilterQuery<T>,
  ): Promise<void>;
}
