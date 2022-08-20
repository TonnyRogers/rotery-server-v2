import { Inject, Injectable } from '@nestjs/common';

import { UserRatingsRepositoryInterface } from '../user-ratings/interfaces/user-ratings-service.interface';
import { MetadataServiceInterface } from './interfaces/metadata-service.interface';

import { LocationRatingsProvider } from '../location-ratings/enums/location-ratings-provider.enum';
import { LocationRatingsRepositoryInterface } from '../location-ratings/interfaces/location-ratings-repository.interface';
import { UserRatingsProvider } from '../user-ratings/enums/user-ratings-providers.enum';

@Injectable()
export class MetadataService implements MetadataServiceInterface {
  constructor(
    @Inject(LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY)
    private readonly locationRatingsRepository: LocationRatingsRepositoryInterface,
    @Inject(UserRatingsProvider.USER_RATINGS_REPOSITORY)
    private readonly userRatingsRepository: UserRatingsRepositoryInterface,
  ) {}

  async backpackerWelcome(
    authUserId: number,
  ): Promise<{ ratedLocations: number; ratedGuides: number }> {
    const locationRatings = await this.locationRatingsRepository.findAll({
      owner: authUserId,
    });

    const guidesRatings = await this.userRatingsRepository.findAll({
      owner: authUserId,
    });

    return {
      ratedLocations: locationRatings.length,
      ratedGuides: guidesRatings.length,
    };
  }

  async guideWelcome(
    authUserId: number,
  ): Promise<{ helpedBackpackers: number }> {
    const usersRatings = await this.userRatingsRepository.findAll({
      user: authUserId,
    });

    return {
      helpedBackpackers: usersRatings.length,
    };
  }
}
