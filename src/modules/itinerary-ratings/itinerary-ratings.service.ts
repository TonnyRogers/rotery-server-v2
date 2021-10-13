import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ItineraryRating } from '../../entities/itinerary-rating';
import { CreateItineraryRatingDto } from './dto/create-itinerary-rating.dto';
import { ItinerariesService } from '../itineraries/itineraries.service';

@Injectable()
export class ItinerariesRatingsService {
  constructor(
    @InjectRepository(ItineraryRating)
    private ItinerariesRatingsRepository: EntityRepository<ItineraryRating>,
    @Inject(ItinerariesService)
    private itinerariessService: ItinerariesService,
  ) {}

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
      throw new HttpException(error.message, error.code);
    }
  }
}
