import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Itinerary } from '../../entities/itinerary.entity';
import { FeedItinerariesController } from './feed-itineraries.controller';
import { FeedItinerariesService } from './feed-itineraries.service';

@Module({
  controllers: [FeedItinerariesController],
  providers: [FeedItinerariesService],
  imports: [MikroOrmModule.forFeature([Itinerary])],
})
export class FeedItinerariesModule {}
