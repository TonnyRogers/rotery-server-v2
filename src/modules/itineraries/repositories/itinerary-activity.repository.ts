import { FilterQuery, EntityData } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ItineraryActivity } from '@/entities/itinerary-activity.entity';

export class ItineraryActivityRepository extends EntityRepository<ItineraryActivity> {
  public async insertJoinTable(
    deleteWhere: FilterQuery<ItineraryActivity>,
    data: EntityData<ItineraryActivity>[],
  ) {
    if (!data.length) return;

    const queryBuilder = this._em.createQueryBuilder(ItineraryActivity);

    await queryBuilder.delete(deleteWhere).execute();

    const insertDataList: EntityData<ItineraryActivity>[] = [];

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
