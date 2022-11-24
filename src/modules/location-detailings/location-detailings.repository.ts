import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import {
  LocationDetailing,
  LocationDetailingType,
} from '@/entities/location-detailing.entity';

import { UpdateLocationDetailingsDto } from './dto/update-location-detailings.dto';
import { LocationDetailingRepositoryInterface } from './interfaces/location-detailings-repository.interface';

export class LocationDetailingRepository
  implements LocationDetailingRepositoryInterface
{
  constructor(
    @InjectRepository(LocationDetailing)
    private readonly locationDetailingsRepository: EntityRepository<LocationDetailing>,
  ) {}

  async create(entity: LocationDetailing): Promise<LocationDetailing> {
    if (
      await this.locationDetailingsRepository.count({
        location: entity.location.id,
        type: entity.type,
      })
    ) {
      throw new UnprocessableEntityException('This detailing already exists.');
    }

    const locationDetailing = this.locationDetailingsRepository.create(entity);
    await this.locationDetailingsRepository.persistAndFlush(locationDetailing);
    return locationDetailing;
  }

  async update(
    locationId: number,
    dto: UpdateLocationDetailingsDto,
  ): Promise<LocationDetailing> {
    const locationDetailing = await this.locationDetailingsRepository.findOne({
      location: locationId,
      type: dto.type,
    });

    if (!locationDetailing)
      throw new UnprocessableEntityException('Location detailing not found.');

    await this.locationDetailingsRepository.removeAndFlush(locationDetailing);

    const updateLocationDetailing = await this.create(
      new LocationDetailing({
        ...dto,
        location: locationDetailing.location,
      }),
    );

    return updateLocationDetailing;
  }

  async delete(filters: {
    locationId: number;
    type: LocationDetailingType;
  }): Promise<void> {
    const locationDetailing = await this.locationDetailingsRepository.findOne({
      location: filters.locationId,
      type: filters.type,
    });

    if (!locationDetailing)
      throw new UnprocessableEntityException(
        "Can't find this location detailing.",
      );

    return await this.locationDetailingsRepository.removeAndFlush(
      locationDetailing,
    );
  }
}
