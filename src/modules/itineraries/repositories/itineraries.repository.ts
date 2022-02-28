import { Itinerary } from "@/entities/itinerary.entity";
import { FilterQuery, NotFoundError } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";

export class ItineraryRepository extends EntityRepository<Itinerary> {
    toJSON() {
        
    }
 
    public async findOneQB(where: FilterQuery<Itinerary>, populate?: string[]) {
        const queryBuilder = this._em.createQueryBuilder(Itinerary,undefined,'read');

        queryBuilder
            .select([
                '*',
            ])
            .where(where);

        populate && populate.forEach(popString => {
            let previusRelationAlias = '';
            popString.split('.').forEach((popItem,index,arr) => {
                if(index === 0) {
                    previusRelationAlias = popItem.slice(0,2);
                    queryBuilder.leftJoinAndSelect(`${popItem}`,`${popItem.slice(0,2)}`);
                }
    
                if(arr.length > 1 && index !== 0) {
                    queryBuilder.leftJoinAndSelect(
                        `${previusRelationAlias}.${popItem}`,
                        `${previusRelationAlias}${popItem.slice(0,2)}`
                    );
                    previusRelationAlias = `${previusRelationAlias}${popItem.slice(0,2)}`;
                }
            });
        });
        
        try {
            const result = await queryBuilder.getSingleResult();

            if(!result) {
                throw new NotFoundError('',Itinerary);
            }

            return result;

        } catch (error) {
            throw error;
        }

    }
}