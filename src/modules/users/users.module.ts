import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UsersService } from './users.service';

import { User } from '../../entities/user.entity';
import { LocationsModule } from '../locations/locations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfileModule } from '../profiles/profile.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    ProfileModule,
    LocationsModule,
    NotificationsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
