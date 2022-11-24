import { LocationRating } from '@/entities/location-rating';

import { UpdateLocationRatingDto } from '../dto/update-location-ratings.dto';

export interface LocationRatingRepositoryQuery {
  ownerId: number;
  locationId: number;
}

export interface FindAllLocationRatingRepositoryQuery {
  owner?: number;
  user?: number;
}

export interface LocationRatingsRepositoryInterface {
  create(entity: LocationRating): Promise<LocationRating>;
  findOne(filter: LocationRatingRepositoryQuery): Promise<LocationRating>;
  update(
    filter: LocationRatingRepositoryQuery,
    updateDto: UpdateLocationRatingDto,
  ): Promise<LocationRating>;
  findAll(
    filter: FindAllLocationRatingRepositoryQuery,
  ): Promise<LocationRating[]>;
}
