import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { LocationDetailingServiceInterface } from './interfaces/location-detailings-service.interface';

import { LocationDetailing } from '@/entities/location-detailing.entity';

import { LocationsProvider } from '../locations/enums/locations-provider.enum';
import { LocationsRepositoryInterface } from '../locations/interfaces/repository-interface';
import { CreateLocationDetailingsDto } from './dto/create-location-detailings.dto';
import { DeleteLocationDetailingsDto } from './dto/delete-location-detailings.dto';
import { UpdateLocationDetailingsDto } from './dto/update-location-detailings.dto';
import { LocationDetailingsProvider } from './enums/location-detailings-provider.enum';
import { LocationDetailingRepositoryInterface } from './interfaces/location-detailings-repository.interface';

@Injectable()
export class LocationDetailingService
  implements LocationDetailingServiceInterface
{
  constructor(
    @Inject(LocationDetailingsProvider.LOCATION_DETAILING_REPOSITORY)
    private readonly locationDetailingsRepository: LocationDetailingRepositoryInterface,
    @Inject(LocationsProvider.LOCATION_REPOSITORY)
    private readonly locationsRepository: LocationsRepositoryInterface,
  ) {}

  async add(
    locationId: number,
    createLocationDetailingDto: CreateLocationDetailingsDto,
  ): Promise<LocationDetailing[]> {
    const location = await this.locationsRepository.findOne({ id: locationId });

    if (!location)
      throw new UnprocessableEntityException(location, 'Location not found.');

    const newLocationDetailingList: LocationDetailing[] = [];

    createLocationDetailingDto.detailings.forEach((item) => {
      newLocationDetailingList.push(
        new LocationDetailing({
          ...item,
          location,
        }),
      );
    });

    return await this.locationDetailingsRepository.create(
      newLocationDetailingList,
    );
  }

  async remove(locationId: number, query: DeleteLocationDetailingsDto) {
    return this.locationDetailingsRepository.delete({
      locationId,
      type: query.type,
    });
  }

  async update(
    locationId: number,
    updateLocationDetailingDto: UpdateLocationDetailingsDto,
  ): Promise<LocationDetailing> {
    const location = await this.locationsRepository.findOne({ id: locationId });

    if (!location)
      throw new UnprocessableEntityException(location, 'Location not found.');

    return this.locationDetailingsRepository.update(
      locationId,
      updateLocationDetailingDto,
    );
  }
}
