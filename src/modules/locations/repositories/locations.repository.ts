import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { GetLocationQueryFilter } from '../interfaces/service-interface';

import { Location } from '@/entities/location.entity';

import {
  FindOneLocationRepositoryFilter,
  LocationsRepositoryInterface,
} from '../interfaces/repository-interface';

export class LocationsRepository implements LocationsRepositoryInterface {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: EntityRepository<Location>,
  ) {}

  async findAll(filters: GetLocationQueryFilter): Promise<Location[] | never> {
    const { city, state } = filters;

    return this.locationsRepository.find(
      {
        ...(city || state ? { locationJson: { city, state } } : {}),
      },
      {
        populate: [
          'detailings',
          'transports.transport',
          'activities.activity',
          'photos',
          'lodgings.lodging',
          'ratings.owner.profile',
        ],
      },
    );
  }

  async findOne(filters: FindOneLocationRepositoryFilter): Promise<Location> {
    const { id, location, name, alias } = filters;
    return this.locationsRepository.findOne({
      ...(id ? { id } : {}),
      ...(alias ? { alias } : {}),
      ...(location && name ? { $and: [{ location, name }] } : {}),
    });
  }

  async create(entity: Location): Promise<Location> {
    const newLocation = this.locationsRepository.create(entity);
    await this.locationsRepository.persistAndFlush(newLocation);

    return newLocation;
  }

  async update(entity: Location): Promise<Location> {
    await this.locationsRepository.nativeUpdate({ id: entity.id }, entity);
    return this.findOne({ id: entity.id });
  }

  async delete(id: number): Promise<void> {
    try {
      const location = await this.locationsRepository.findOneOrFail({ id });
      return await this.locationsRepository.removeAndFlush(location);
    } catch (err) {
      throw new UnprocessableEntityException("Can't find this location.");
    }
  }
}
