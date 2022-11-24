import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FeedItinerariesService } from './feed-itineraries.service';

import { Itinerary } from '../../entities/itinerary.entity';
import { FeedItinerariesController } from './feed-itineraries.controller';

@Module({
  controllers: [FeedItinerariesController],
  providers: [FeedItinerariesService],
  imports: [MikroOrmModule.forFeature([Itinerary])],
})
export class FeedItinerariesModule {}
