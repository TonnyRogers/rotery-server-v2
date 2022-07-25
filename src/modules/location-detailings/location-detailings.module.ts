import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { LocationDetailing } from '@/entities/location-detailing.entity';

import { LocationsModule } from '../locations/locations.module';
import { LocationDetailingController } from './location-detailings.controller';
import { locationDetailingProvider } from './providers';

@Module({
  imports: [MikroOrmModule.forFeature([LocationDetailing]), LocationsModule],
  controllers: [LocationDetailingController],
  providers: locationDetailingProvider,
  exports: locationDetailingProvider,
})
export class LocationDetailingModule {}
