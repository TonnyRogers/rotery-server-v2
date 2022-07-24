import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { ProfileModule } from '../profiles/profile.module';
import { User } from '../../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LocationsModule } from '../locations/locations.module';
import { GuideUserLocationsService } from './guide-user-locations.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), ProfileModule, LocationsModule],
  providers: [UsersService, GuideUserLocationsService],
  controllers: [UsersController],
  exports: [UsersService, GuideUserLocationsService],
})
export class UsersModule {}
