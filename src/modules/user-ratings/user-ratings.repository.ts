import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import {
  UserRatingsRepositoryFindAllQuery,
  UserRatingsRepositoryInterface,
} from './interfaces/user-ratings-service.interface';

import { UserRating } from '@/entities/user-rating';

export class UserRatingsRepository implements UserRatingsRepositoryInterface {
  constructor(
    @InjectRepository(UserRating)
    private readonly userRatingsRepository: EntityRepository<UserRating>,
  ) {}

  async create(entity: UserRating): Promise<UserRating> {
    const newRating = this.userRatingsRepository.create(entity);

    await this.userRatingsRepository.persistAndFlush(entity);

    return newRating;
  }

  async findAll(
    filter: UserRatingsRepositoryFindAllQuery,
  ): Promise<UserRating[]> {
    return await this.userRatingsRepository.find({ ...filter });
  }
}
