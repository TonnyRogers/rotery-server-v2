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

  async create(entity: LocationDetailing[]): Promise<LocationDetailing[]> {
    const queryBuilder = this.locationDetailingsRepository.createQueryBuilder();
    for (const entityItem of entity) {
      if (
        await this.locationDetailingsRepository.count({
          location: entityItem.location.id,
          type: entityItem.type,
        })
      ) {
        throw new UnprocessableEntityException(
          'This detailing already exists.',
        );
      }
    }

    await queryBuilder.insert(entity).execute();
    return await this.locationDetailingsRepository.find({
      location: entity[0].location.id,
    });
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

    const updateLocationDetailing = await this.create([
      new LocationDetailing({
        ...dto,
        location: locationDetailing.location,
      }),
    ]);

    return updateLocationDetailing[0];
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
