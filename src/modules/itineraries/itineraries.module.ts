import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ItineraryPhoto } from 'src/entities/itinerary-photo.entity';
import { ItineraryActivity } from '../../entities/itinerary-activity.entity';
import { ItineraryLodging } from '../../entities/itinerary-lodging.entity';
import { ItineraryTransport } from '../../entities/itinerary-transport.entity';
import { Itinerary } from '../../entities/itinerary.entity';
import { UsersModule } from '../users/users.module';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesService } from './itineraries.service';

@Module({
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
  imports: [
    MikroOrmModule.forFeature([
      Itinerary,
      ItineraryActivity,
      ItineraryLodging,
      ItineraryTransport,
      ItineraryPhoto,
    ]),
    UsersModule,
  ],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}
