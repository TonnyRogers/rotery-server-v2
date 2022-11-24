import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FavoriteItinerariesService } from './favorite-itineraries.service';

import { User } from '../../entities/user.entity';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { FavoriteItinerariesController } from './favorite-itineraries.controller';

@Module({
  controllers: [FavoriteItinerariesController],
  providers: [FavoriteItinerariesService],
  imports: [MikroOrmModule.forFeature([User]), ItinerariesModule],
})
export class FavoriteItinerariesModule {}
