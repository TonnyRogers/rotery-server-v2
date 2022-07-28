import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LocationRatingsServiceInterface } from './interfaces/location-ratings-service.interface';

import { LocationRating } from '@/entities/location-rating';

import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { LocationsRepositoryInterface } from '../locations/interfaces/repository-interface';
import { CreateLocationRatingDto } from './dto/create-location-ratings.dto';
import { FindLocationRatingsDto } from './dto/find-location-ratings.dto';
import { UpdateLocationRatingDto } from './dto/update-location-ratings.dto';
import { LocationRatingsProvider } from './enums/location-ratings-provider.enum';
import { LocationRatingsRepositoryInterface } from './interfaces/location-ratings-repository.interface';

@Injectable()
export class LocationRatingsService implements LocationRatingsServiceInterface {
  constructor(
    @Inject(LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY)
    private readonly locationRatingsRepository: LocationRatingsRepositoryInterface,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationsRespository: LocationsRepositoryInterface,
  ) {}
  async add(
    authUserId: number,
    locationId: number,
    creatDto: CreateLocationRatingDto,
  ): Promise<LocationRating> {
    const owner = await this.usersService.findOne({ id: authUserId });
    const location = await this.locationsRespository.findOne({
      id: locationId,
    });

    if (!owner) throw new UnprocessableEntityException("Can't find this user.");

    if (!location)
      throw new UnprocessableEntityException("Can't find this location.");

    const newLocationRating = new LocationRating({
      ...creatDto,
      owner,
      location,
    });

    return this.locationRatingsRepository.create(newLocationRating);
  }

  async getOne({
    locationId,
    ownerId,
  }: FindLocationRatingsDto): Promise<LocationRating> {
    return this.locationRatingsRepository.findOne({
      locationId,
      ownerId,
    });
  }

  async update(
    authUserId: number,
    locationId: number,
    updateDto: UpdateLocationRatingDto,
  ): Promise<LocationRating> {
    const owner = await this.usersService.findOne({ id: authUserId });
    const location = await this.locationsRespository.findOne({
      id: locationId,
    });

    if (!owner) throw new UnprocessableEntityException("Can't find this user.");

    if (!location)
      throw new UnprocessableEntityException("Can't find this location.");

    return this.locationRatingsRepository.update(
      {
        locationId,
        ownerId: authUserId,
      },
      updateDto,
    );
  }
}
