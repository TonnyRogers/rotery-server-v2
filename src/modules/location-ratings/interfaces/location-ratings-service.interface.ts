import { LocationRating } from '@/entities/location-rating';

import { CreateLocationRatingDto } from '../dto/create-location-ratings.dto';
import { FindLocationRatingsDto } from '../dto/find-location-ratings.dto';
import { UpdateLocationRatingDto } from '../dto/update-location-ratings.dto';

export interface LocationRatingsServiceInterface {
  add(
    authUserId: number,
    locationId: number,
    creatDto: CreateLocationRatingDto,
  ): Promise<LocationRating>;
  getOne(findDto: FindLocationRatingsDto): Promise<LocationRating>;
  update(
    authUserId: number,
    locationId: number,
    updateDto: UpdateLocationRatingDto,
  ): Promise<LocationRating>;
  findAllByOwner(authUserId: number): Promise<LocationRating[]>;
}
