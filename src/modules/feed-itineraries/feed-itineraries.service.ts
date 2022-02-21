import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpException, Injectable } from '@nestjs/common';
import momentTimezone from 'moment-timezone';

import { Itinerary, ItineraryStatus } from '../../entities/itinerary.entity';
import { itineraryRelations } from '../../../utils/constants';
import { PaginatedResponse } from '../../../utils/types';
import { QueryFilter } from './interfaces/feed-filter';

@Injectable()
export class FeedItinerariesService {
  constructor(
    @InjectRepository(Itinerary)
    private feedItinerariesRepository: EntityRepository<Itinerary>,
  ) {}

  async findAll(
    auuthUserId: number,
    filter: QueryFilter,
  ): Promise<PaginatedResponse<Itinerary>> {
    try {
      const { limit = 10, page = 1, ...rest } = filter;

      const offset = (page - 1) * limit;

      const dynamicFilter: any = {};

      Object.entries(rest).forEach(([key, value]) => {
        switch (key) {
          case 'begin':
            dynamicFilter.begin = {
              $gte: momentTimezone(value).startOf('day').toISOString(),
              $lte: momentTimezone(value).endOf('day').toISOString(),
            };
            break;
          case 'end':
            dynamicFilter.end = {
              $gte: momentTimezone(value).startOf('day').toISOString(),
              $lte: momentTimezone(value).endOf('day').toISOString(),
            };
            break;
          case 'city':
            dynamicFilter.locationJson = {
              ...dynamicFilter.locationJson,
              [key]: value,
            };
            break;
          case 'state':
            dynamicFilter.locationJson = {
              ...dynamicFilter.locationJson,
              [key]: value,
            };
            break;

          default:
            break;
        }
      });

      const items = await this.feedItinerariesRepository.find(
        {
          ...dynamicFilter,
          status: ItineraryStatus.ACTIVE,
          isPrivate: false,
          $not: { owner: auuthUserId },
          deletedAt: null,
        },
        { offset, limit },
      );

      await this.feedItinerariesRepository.populate(items, itineraryRelations, {
        members: { deletedAt: null },
      });

      const totalRecords = await this.feedItinerariesRepository.count({
        ...dynamicFilter,
        status: ItineraryStatus.ACTIVE,
        deletedAt: null,
        $not: { owner: auuthUserId },
        isPrivate: false,
      });

      const meta = {
        currentPage: +page,
        itemCount: items.length,
        itemsPerPage: +limit,
        totalItems: totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      };

      return { items, meta };
    } catch (error) {
      throw new HttpException('Error on get feed.', 400);
    }
  }

  async findOne(itineraryId: number) {
    try {
      const feedFind = await this.feedItinerariesRepository.findOneOrFail({
        id: itineraryId,
        deletedAt: null,
      });

      await this.feedItinerariesRepository.populate(
        feedFind,
        itineraryRelations,
        {
          members: { deletedAt: null },
        },
      );

      return feedFind;
    } catch (error) {
      throw new HttpException("Can't find this itinerary.", 404);
    }
  }
}
