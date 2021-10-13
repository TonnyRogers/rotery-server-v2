import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ItineraryRating } from '../../entities/itinerary-rating';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { ItinerariesRatingsController } from './itinerary-ratings.controller';
import { ItinerariesRatingsService } from './itinerary-ratings.service';

@Module({
  controllers: [ItinerariesRatingsController],
  providers: [ItinerariesRatingsService],
  imports: [MikroOrmModule.forFeature([ItineraryRating]), ItinerariesModule],
})
export class ItinerariesRatingsModule {}
