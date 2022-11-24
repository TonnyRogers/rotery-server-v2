import { FilterQuery, EntityData } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ItineraryLodging } from '@/entities/itinerary-lodging.entity';

export class ItineraryLodgingRepository extends EntityRepository<ItineraryLodging> {
  public async insertJoinTable(
    deleteWhere: FilterQuery<ItineraryLodging>,
    data: EntityData<ItineraryLodging>[],
  ) {
    if (!data.length) return;

    const queryBuilder = this._em.createQueryBuilder(ItineraryLodging);

    await queryBuilder.delete(deleteWhere).execute();

    const insertDataList: EntityData<ItineraryLodging>[] = [];

    for (const insertData of data) {
      insertDataList.push(insertData);
    }

    try {
      await queryBuilder.insert(insertDataList).execute();
    } catch (error) {
      throw error;
    }
  }
}
