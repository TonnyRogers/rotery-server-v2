import { UserRating } from '@/entities/user-rating';

import { UpdateUserRatingDto } from '../dto/update-user-rating.dto';

export interface UserRatingsRepositoryFindAllQuery {
  user?: number;
  owner?: number;
}

export interface UserRatingsRepositoryFindOneQuery {
  user?: number;
  owner?: number;
}

export interface UserRatingsRepositoryInterface {
  create(entity: UserRating): Promise<UserRating>;
  findAll(filter: UserRatingsRepositoryFindAllQuery): Promise<UserRating[]>;
  findOne(filter: UserRatingsRepositoryFindOneQuery): Promise<UserRating>;
  update(
    authUserId: number,
    userId: number,
    dto: UpdateUserRatingDto,
  ): Promise<UserRating>;
}
