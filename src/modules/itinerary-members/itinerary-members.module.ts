import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Itinerary } from 'src/entities/itinerary.entity';
import { ItineraryMember } from '../../entities/itinerary-member.entity';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { UsersModule } from '../users/users.module';
import { ItineraryMembersController } from './itinerary-members.controller';
import { ItineraryMembersService } from './itinerary-members.service';

@Module({
  controllers: [ItineraryMembersController],
  providers: [ItineraryMembersService],
  imports: [
    MikroOrmModule.forFeature([ItineraryMember, Itinerary]),
    ItinerariesModule,
    UsersModule,
  ],
})
export class ItineraryMembersModule {}
