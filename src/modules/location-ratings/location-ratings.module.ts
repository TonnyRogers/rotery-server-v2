import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { LocationRating } from '@/entities/location-rating';

import { LocationsModule } from '../locations/locations.module';
import { UsersModule } from '../users/users.module';
import { LocationRatingsController } from './location-ratings.controller';
import { locationRatingsProvider } from './providers';

@Module({
  imports: [
    MikroOrmModule.forFeature([LocationRating]),
    UsersModule,
    LocationsModule,
  ],
  controllers: [LocationRatingsController],
  providers: locationRatingsProvider,
})
export class LocationRatingsModule {}
