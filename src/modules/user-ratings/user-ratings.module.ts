import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserRating } from '../../entities/user-rating';
import { UsersModule } from '../users/users.module';
import { userRatingsProvider } from './providers';
import { UserRatingsController } from './user-ratings.controller';

@Module({
  controllers: [UserRatingsController],
  providers: userRatingsProvider,
  imports: [MikroOrmModule.forFeature([UserRating]), UsersModule],
})
export class UserRatingsModule {}
