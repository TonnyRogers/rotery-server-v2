import { UserRating } from '@/entities/user-rating';

import { CreateUserRatingDto } from '../dto/create-user-rating.dto';

export interface UserRatingsServiceInterface {
  create(
    authUserId: number,
    userId: number,
    createUserRatingDto: CreateUserRatingDto,
  ): Promise<UserRating>;
  findAllByOwner(authUserId: number): Promise<UserRating[]>;
}
