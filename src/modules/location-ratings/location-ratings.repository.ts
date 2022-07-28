import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { LocationRating } from '@/entities/location-rating';

import { UpdateLocationRatingDto } from './dto/update-location-ratings.dto';
import {
  LocationRatingRepositoryQuery,
  LocationRatingsRepositoryInterface,
} from './interfaces/location-ratings-repository.interface';

export class LocationRatingsRepository
  implements LocationRatingsRepositoryInterface
{
  constructor(
    @InjectRepository(LocationRating)
    private readonly locationRatingsRepository: EntityRepository<LocationRating>,
  ) {}
  async create(entity: LocationRating): Promise<LocationRating> {
    const newLocationRating = this.locationRatingsRepository.create(entity);
    await this.locationRatingsRepository.persistAndFlush(newLocationRating);
    return newLocationRating;
  }

  async findOne(
    filter: LocationRatingRepositoryQuery,
  ): Promise<LocationRating> {
    return this.locationRatingsRepository.findOne({
      location: filter.locationId,
      owner: filter.ownerId,
    });
  }

  async update(
    filter: LocationRatingRepositoryQuery,
    updateDto: UpdateLocationRatingDto,
  ): Promise<LocationRating> {
    let locationRating = await this.locationRatingsRepository.findOne({
      location: filter.locationId,
      owner: filter.ownerId,
    });

    if (!locationRating) {
      throw new UnprocessableEntityException(
        "Can't find this location rating.",
      );
    }

    locationRating = {
      ...locationRating,
      ...updateDto,
    };

    const locationRatingUpdated = this.locationRatingsRepository.merge(
      locationRating,
      { refresh: true },
    );

    await this.locationRatingsRepository.nativeUpdate(
      {
        location: filter.locationId,
        owner: filter.ownerId,
      },
      locationRating,
    );

    return locationRatingUpdated;
  }
}
