import { FilterQuery, EntityData } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ItineraryPhoto } from '@/entities/itinerary-photo.entity';

export class ItineraryPhotoRepository extends EntityRepository<ItineraryPhoto> {
  public async insertJoinTable(
    deleteWhere: FilterQuery<ItineraryPhoto>,
    data: EntityData<ItineraryPhoto>[],
  ) {
    if (!data.length) return;

    const queryBuilder = this._em.createQueryBuilder(ItineraryPhoto);

    await queryBuilder.delete(deleteWhere).execute();

    const insertDataList: EntityData<ItineraryPhoto>[] = [];

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
