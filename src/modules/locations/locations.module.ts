import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { LocationActivity } from '@/entities/location-activity.entity';
import { LocationLodging } from '@/entities/location-lodging.entity';
import { LocationPhoto } from '@/entities/location-photo.entity';
import { LocationTransport } from '@/entities/location-transport.entity';
import { Location } from '@/entities/location.entity';

import { LocationsController } from './locations.controller';
import { locationsProvider } from './providers';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Location,
      LocationActivity,
      LocationTransport,
      LocationLodging,
      LocationPhoto,
    ]),
  ],
  controllers: [LocationsController],
  providers: locationsProvider,
  exports: locationsProvider,
})
export class LocationsModule {}
