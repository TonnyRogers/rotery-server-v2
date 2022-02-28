import { ItineraryTransport } from "@/entities/itinerary-transport.entity";
import { Populate, FilterQuery, QueryOrderMap, Loaded, FindOneOptions, EntityData, UpdateOptions } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";

export class ItineraryTransportRepository extends EntityRepository<ItineraryTransport> {

    public async insertJoinTable(deleteWhere: FilterQuery<ItineraryTransport>,data: EntityData<ItineraryTransport>[]) {
        const queryBuilder = this._em.createQueryBuilder(ItineraryTransport);


        await queryBuilder.delete(deleteWhere).execute();

        const insertDataList: EntityData<ItineraryTransport>[] = [];
        
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