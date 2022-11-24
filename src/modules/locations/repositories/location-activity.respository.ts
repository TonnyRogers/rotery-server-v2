import { UnprocessableEntityException } from '@nestjs/common';

import { FilterQuery, EntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { LocationActivity } from '@/entities/location-activity.entity';

import { LocationBaseRelatedRepositoryInterface } from '../interfaces/repository-interface';

export class LocationActivityRepository
  implements LocationBaseRelatedRepositoryInterface<LocationActivity>
{
  constructor(
    @InjectRepository(LocationActivity)
    private readonly locationActivityRepository: EntityRepository<LocationActivity>,
  ) {}

  async insertJoinTable(
    data: EntityData<LocationActivity>[],
    deleteWhere?: FilterQuery<LocationActivity>,
  ): Promise<void> {
    const queryBuilder =
      this.locationActivityRepository.createQueryBuilder('la');

    deleteWhere && (await queryBuilder.delete(deleteWhere).execute());

    if (!data?.length) return;

    const insertDataList: EntityData<LocationActivity>[] = [];

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
