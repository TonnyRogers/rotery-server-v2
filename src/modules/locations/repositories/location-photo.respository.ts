import { UnprocessableEntityException } from '@nestjs/common';

import { FilterQuery, EntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { LocationPhoto } from '@/entities/location-photo.entity';

import { LocationBaseRelatedRepositoryInterface } from '../interfaces/repository-interface';

export class LocationPhotoRepository
  implements LocationBaseRelatedRepositoryInterface<LocationPhoto>
{
  constructor(
    @InjectRepository(LocationPhoto)
    private readonly locationPhotoRepository: EntityRepository<LocationPhoto>,
  ) {}

  async insertJoinTable(
    data: EntityData<LocationPhoto>[],
    deleteWhere?: FilterQuery<LocationPhoto>,
  ): Promise<void> {
    const queryBuilder = this.locationPhotoRepository.createQueryBuilder('lp');

    deleteWhere && (await queryBuilder.delete(deleteWhere).execute());

    if (!data?.length) return;

    const insertDataList: EntityData<LocationPhoto>[] = [];

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
