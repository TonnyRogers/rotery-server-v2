import { forwardRef, Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ItinerariesService } from './itineraries.service';

import { ItineraryActivity } from '@/entities/itinerary-activity.entity';
import { ItineraryLodging } from '@/entities/itinerary-lodging.entity';
import { ItineraryPhoto } from '@/entities/itinerary-photo.entity';
import { ItineraryTransport } from '@/entities/itinerary-transport.entity';
import { Itinerary } from '@/entities/itinerary.entity';

import { DirectMessagesModule } from '../direct-messages/direct-messages.module';
import { EmailsModule } from '../emails/emails.module';
import { ItineraryMembersModule } from '../itinerary-members/itinerary-members.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersModule } from '../users/users.module';
import { ItinerariesController } from './itineraries.controller';

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
    forwardRef(() => ItineraryMembersModule),
    SubscriptionsModule,
    EmailsModule,
  ],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}
