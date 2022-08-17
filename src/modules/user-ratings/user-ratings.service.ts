import { Inject, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UserRatingsRepositoryInterface } from './interfaces/user-ratings-service.interface';

import { UserRating } from '../../entities/user-rating';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { UserRatingsProvider } from './enums/user-ratings-providers.enum';
import { UserRatingsServiceInterface } from './interfaces/user-ratings-repository.interface';

@Injectable()
export class UserRatingsService implements UserRatingsServiceInterface {
  constructor(
    @Inject(UserRatingsProvider.USER_RATINGS_REPOSITORY)
    private userRatingsRepository: UserRatingsRepositoryInterface,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async create(
    authUserId: number,
    userId: number,
    createUserRatingDto: CreateUserRatingDto,
  ) {
    try {
      const ownerUser = await this.usersService.findOne({ id: authUserId });
      const user = await this.usersService.findOne({ id: userId });
      const newRating = new UserRating({
        user: user,
        owner: ownerUser,
        ...createUserRatingDto,
      });
      return await this.userRatingsRepository.create(newRating);
    } catch (error) {
      throw error;
    }
  }

  async findAllByOwner(authUserId: number): Promise<UserRating[]> {
    return await this.userRatingsRepository.findAll({ owner: authUserId });
  }
}
