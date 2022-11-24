import { UnprocessableEntityException } from '@nestjs/common';

import { FilterQuery, EntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { LocationLodging } from '@/entities/location-lodging.entity';

import { LocationBaseRelatedRepositoryInterface } from '../interfaces/repository-interface';

export class LocationLodgingRepository
  implements LocationBaseRelatedRepositoryInterface<LocationLodging>
{
  constructor(
    @InjectRepository(LocationLodging)
    private readonly locationLodgingRepository: EntityRepository<LocationLodging>,
  ) {}

  async insertJoinTable(
    data: EntityData<LocationLodging>[],
    deleteWhere?: FilterQuery<LocationLodging>,
  ): Promise<void> {
    const queryBuilder =
      this.locationLodgingRepository.createQueryBuilder('ll');

    deleteWhere && (await queryBuilder.delete(deleteWhere).execute());

    if (!data?.length) return;

    const insertDataList: EntityData<LocationLodging>[] = [];

    for (const insertData of data) {
      insertDataList.push(insertData);
    }

    try {
      await queryBuilder.insert(insertDataList).execute();
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }
}
