import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { GetLocationQueryFilter } from '../interfaces/service-interface';

import { Location } from '@/entities/location.entity';
import { PaginatedResponse } from '@/utils/types';

import { GetLocationFeedQueryFilter } from '../dto/get-feed-query-filter.dto';
import {
  FindOneLocationRepositoryFilter,
  LocationsRepositoryInterface,
} from '../interfaces/repository-interface';

const populateRelations: any = [
  'detailings',
  'transports.transport',
  'activities.activity',
  'photos',
  'lodgings.lodging',
  'ratings.owner.profile',
];
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
        populate: populateRelations,
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

  async findAsFeed({
    page = 1,
    limit = 10,
    ...restFilters
  }: GetLocationFeedQueryFilter): Promise<PaginatedResponse<Location>> {
    const offset = (page - 1) * limit;

    const dynamicFilter: any = {};

    if (restFilters.city || restFilters.state || restFilters.region) {
      dynamicFilter.locationJson = {};
    }

    Object.entries(restFilters).forEach(([key, value]) => {
      switch (key) {
        case 'city':
          dynamicFilter.locationJson[key] = value;
          break;
        case 'state':
          dynamicFilter.locationJson[key] = value;
          break;
        case 'region':
          dynamicFilter.locationJson[key] = value;
          break;
        case 'type':
          dynamicFilter[key] = value;
          break;
        case 'activity':
          dynamicFilter.activities = {
            activity: {
              id: value,
            },
          };
          break;

        default:
          break;
      }
    });

    const items = await this.locationsRepository.find(
      {
        ...dynamicFilter,
      },
      {
        populate: populateRelations,
        limit,
        offset,
        orderBy: { name: 1 },
      },
    );

    const totalItems = await this.locationsRepository.count({
      ...dynamicFilter,
    });

    const meta = {
      currentPage: page,
      itemCount: items.length,
      itemsPerPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };

    return {
      meta,
      items,
    };
  }
}
