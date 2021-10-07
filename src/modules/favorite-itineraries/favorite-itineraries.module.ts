import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { FavoriteItinerariesController } from './favorite-itineraries.controller';
import { FavoriteItinerariesService } from './favorite-itineraries.service';

@Module({
  controllers: [FavoriteItinerariesController],
  providers: [FavoriteItinerariesService],
  imports: [MikroOrmModule.forFeature([User]), ItinerariesModule],
})
export class FavoriteItinerariesModule {}
