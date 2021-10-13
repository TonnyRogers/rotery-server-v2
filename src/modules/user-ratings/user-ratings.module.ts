import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserRating } from '../../entities/user-rating';
import { UsersModule } from '../users/users.module';
import { UserRatingsController } from './user-ratings.controller';
import { UserRatingsService } from './user-ratings.service';

@Module({
  controllers: [UserRatingsController],
  providers: [UserRatingsService],
  imports: [MikroOrmModule.forFeature([UserRating]), UsersModule],
})
export class UserRatingsModule {}
