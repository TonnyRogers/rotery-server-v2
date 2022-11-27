import { UnprocessableEntityException } from '@nestjs/common';

import { FilterQuery, EntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { LocationTransport } from '@/entities/location-transport.entity';

import { LocationBaseRelatedRepositoryInterface } from '../interfaces/repository-interface';

export class LocationTransportRepository
  implements LocationBaseRelatedRepositoryInterface<LocationTransport>
{
  constructor(
    @InjectRepository(LocationTransport)
    private readonly locationTransportRepository: EntityRepository<LocationTransport>,
  ) {}

  async insertJoinTable(
    data: EntityData<LocationTransport>[],
    deleteWhere?: FilterQuery<LocationTransport>,
  ): Promise<void> {
    const deleteQueryBuilder =
      this.locationTransportRepository.createQueryBuilder('lt');
    const insertQueryBuilder =
      this.locationTransportRepository.createQueryBuilder('lt');

    deleteWhere && (await deleteQueryBuilder.delete(deleteWhere).execute());

    if (!data?.length) return;

    const insertDataList: EntityData<LocationTransport>[] = [];

    for (const insertData of data) {
      insertDataList.push(insertData);
    }

    try {
      await insertQueryBuilder.insert(insertDataList).execute();
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
