import { forwardRef, Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ItineraryMembersService } from './itinerary-members.service';

import { ItineraryMember } from '../../entities/itinerary-member.entity';
import { Itinerary } from '../../entities/itinerary.entity';
import { EmailsModule } from '../emails/emails.module';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentModule } from '../payments/payments.module';
import { UsersModule } from '../users/users.module';
import { ItineraryMembersController } from './itinerary-members.controller';

@Module({
  controllers: [ItineraryMembersController],
  providers: [ItineraryMembersService],
  imports: [
    MikroOrmModule.forFeature([ItineraryMember, Itinerary]),
    forwardRef(() => ItinerariesModule),
    UsersModule,
    NotificationsModule,
    PaymentModule,
    EmailsModule,
  ],
  exports: [ItineraryMembersService],
})
export class ItineraryMembersModule {}
