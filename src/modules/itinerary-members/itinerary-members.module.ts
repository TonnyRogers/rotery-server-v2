import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { Itinerary } from '../../entities/itinerary.entity';
import { ItineraryMember } from '../../entities/itinerary-member.entity';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { ItineraryMembersController } from './itinerary-members.controller';
import { ItineraryMembersService } from './itinerary-members.service';
import { PaymentModule } from '../payments/payments.module';
import { EmailsModule } from '../emails/emails.module';

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
