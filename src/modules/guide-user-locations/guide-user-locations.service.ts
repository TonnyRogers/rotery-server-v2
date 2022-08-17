import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { GuideUserLocationsServiceInterface } from './interfaces/guide-user-locations-service.interface';

import { GuideUserLocation } from '@/entities/guide-user-location.entity';

import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { LocationsRepositoryInterface } from '../locations/interfaces/repository-interface';
import { GuideUserLocationsProvider } from './enums/guide-user-locations-provider';
import { GuideUserLocationsRepositoryInterface } from './interfaces/guide-user-locations-repository.interface';

@Injectable()
export class GuideUserLocationsService
  implements GuideUserLocationsServiceInterface
{
  constructor(
    @Inject(GuideUserLocationsProvider.GUIDE_USER_LOCATIONS_REPOSITORY)
    private readonly guideUserLocationRepository: GuideUserLocationsRepositoryInterface,
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationRepository: LocationsRepositoryInterface,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async add(
    authUserId: number,
    locationId: number,
  ): Promise<GuideUserLocation> {
    const user = await this.userService.findOne({ id: authUserId });

    if (!user) {
      throw new UnprocessableEntityException("Can't find user.");
    }

    const location = await this.locationRepository.findOne({ id: locationId });
    if (!location) {
      throw new UnprocessableEntityException("Can't find location.");
    }

    const existedLocationCount = await this.guideUserLocationRepository.count({
      location: location.id,
      user: user.id,
    });
    if (existedLocationCount > 0) {
      throw new UnprocessableEntityException('You already have this location.');
    }

    const newGuideLocation = new GuideUserLocation({
      location,
      user,
    });

    return await this.guideUserLocationRepository.create(newGuideLocation);
  }

  async remove(authUserId: number, locationId: number): Promise<void> {
    return await this.guideUserLocationRepository.delete({
      user: authUserId,
      location: locationId,
    });
  }

  async listAll(locationId: number): Promise<GuideUserLocation[]> {
    return await this.guideUserLocationRepository.findAll({
      location: locationId,
    });
  }
}
