import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ItinerariesRatingsService } from './itinerary-ratings.service';

import { ItineraryRating } from '../../entities/itinerary-rating';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ItinerariesRatingsController } from './itinerary-ratings.controller';

@Module({
  controllers: [ItinerariesRatingsController],
  providers: [ItinerariesRatingsService],
  imports: [
    MikroOrmModule.forFeature([ItineraryRating]),
    ItinerariesModule,
    NotificationsModule,
  ],
})
export class ItinerariesRatingsModule {}
