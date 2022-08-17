import { UserRating } from '@/entities/user-rating';

export interface UserRatingsRepositoryFindAllQuery {
  user?: number;
  owner?: number;
}

export interface UserRatingsRepositoryInterface {
  create(entity: UserRating): Promise<UserRating>;
  findAll(filter: UserRatingsRepositoryFindAllQuery): Promise<UserRating[]>;
}
