import { Inject, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UserRatingsRepositoryInterface } from './interfaces/user-ratings-service.interface';

import { UserRating } from '../../entities/user-rating';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { UserRatingsProvider } from './enums/user-ratings-providers.enum';
import { UserRatingsServiceInterface } from './interfaces/user-ratings-repository.interface';

@Injectable()
export class UserRatingsService implements UserRatingsServiceInterface {
  constructor(
    @Inject(UserRatingsProvider.USER_RATINGS_REPOSITORY)
    private userRatingsRepository: UserRatingsRepositoryInterface,
    @Inject(UsersProvider.USERS_SERVICE)
    private usersService: UsersService,
  ) {}

  async create(
    authUserId: number,
    userId: number,
    createUserRatingDto: CreateUserRatingDto,
  ) {
    try {
      const existedRating = await this.userRatingsRepository.findOne({
        owner: authUserId,
        user: userId,
      });

      if (existedRating) {
        await this.userRatingsRepository.update(
          authUserId,
          userId,
          createUserRatingDto,
        );

        return await this.userRatingsRepository.findOne({
          owner: authUserId,
          user: userId,
        });
      } else {
        const ownerUser = await this.usersService.findOne({ id: authUserId });
        const user = await this.usersService.findOne({ id: userId });
        const newRating = new UserRating({
          user: user,
          owner: ownerUser,
          ...createUserRatingDto,
        });
        return await this.userRatingsRepository.create(newRating);
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllByOwner(authUserId: number): Promise<UserRating[]> {
    return await this.userRatingsRepository.findAll({ owner: authUserId });
  }
}
