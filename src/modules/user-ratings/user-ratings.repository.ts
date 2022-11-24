import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import {
  UserRatingsRepositoryFindAllQuery,
  UserRatingsRepositoryFindOneQuery,
  UserRatingsRepositoryInterface,
} from './interfaces/user-ratings-service.interface';

import { UserRating } from '@/entities/user-rating';

import { UpdateUserRatingDto } from './dto/update-user-rating.dto';

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

  async findOne(
    filter: UserRatingsRepositoryFindOneQuery,
  ): Promise<UserRating> {
    return await this.userRatingsRepository.findOne({ ...filter });
  }

  async update(
    authUserId: number,
    userId: number,
    dto: UpdateUserRatingDto,
  ): Promise<UserRating> {
    await this.userRatingsRepository.nativeUpdate(
      { owner: authUserId, user: userId },
      {
        ...dto,
      },
    );

    return this.findOne({ owner: authUserId, user: userId });
  }
}
