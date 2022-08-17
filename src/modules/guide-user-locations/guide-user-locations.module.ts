import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { GuideUserLocation } from '@/entities/guide-user-location.entity';

import { LocationsModule } from '../locations/locations.module';
import { UsersModule } from '../users/users.module';
import { GuideUserLocationsController } from './guide-user-locations.controller';
import { guideUserLocationsProviders } from './providers';

@Module({
  controllers: [GuideUserLocationsController],
  providers: guideUserLocationsProviders,
  imports: [
    MikroOrmModule.forFeature([GuideUserLocation]),
    UsersModule,
    LocationsModule,
  ],
})
export class GuideUserLocationsModule {}
