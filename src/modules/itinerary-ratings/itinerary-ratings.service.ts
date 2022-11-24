import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ItinerariesService } from '../itineraries/itineraries.service';

import { ItineraryRating } from '../../entities/itinerary-rating';
import { CreateItineraryRatingDto } from './dto/create-itinerary-rating.dto';

@Injectable()
export class ItinerariesRatingsService {
  constructor(
    @InjectRepository(ItineraryRating)
    private ItinerariesRatingsRepository: EntityRepository<ItineraryRating>,
    @Inject(ItinerariesService)
    private itinerariessService: ItinerariesService,
  ) {}

  async findOne(itineraryRatingId: string) {
    try {
      return this.ItinerariesRatingsRepository.findOneOrFail({
        id: itineraryRatingId,
      });
    } catch (error) {
      throw error;
    }
  }

  async create(
    itineraryId: number,
    createItineraryRatingDto: CreateItineraryRatingDto,
  ) {
    try {
      const itinerary = await this.itinerariessService.show(itineraryId);

      const newRating = new ItineraryRating({
        itinerary: 'id' in itinerary && itinerary,
        ...createItineraryRatingDto,
      });
      await this.ItinerariesRatingsRepository.persistAndFlush(newRating);

      return newRating;
    } catch (error) {
      throw error;
    }
  }
}
