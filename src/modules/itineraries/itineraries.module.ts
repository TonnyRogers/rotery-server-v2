import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ItineraryPhoto } from '../../entities/itinerary-photo.entity';
import { ItineraryActivity } from '../../entities/itinerary-activity.entity';
import { ItineraryLodging } from '../../entities/itinerary-lodging.entity';
import { ItineraryTransport } from '../../entities/itinerary-transport.entity';
import { Itinerary } from '../../entities/itinerary.entity';
import { DirectMessagesModule } from '../direct-messages/direct-messages.module';
import { NotificationsModule } from '../notifications/notifications.module';
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
    NotificationsModule,
    DirectMessagesModule,
  ],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}
