import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ItineraryQuestionsService } from './itinerary-question.service';

import { ItineraryQuestion } from '../../entities/itinerary-question.entity';
import { Itinerary } from '../../entities/itinerary.entity';
import { User } from '../../entities/user.entity';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { UsersModule } from '../users/users.module';
import { ItineraryQuestionsController } from './itinerary-question.controller';

@Module({
  controllers: [ItineraryQuestionsController],
  providers: [ItineraryQuestionsService],
  imports: [
    MikroOrmModule.forFeature([ItineraryQuestion, User, Itinerary]),
    UsersModule,
    ItinerariesModule,
  ],
})
export class ItineraryQuestionsModule {}
