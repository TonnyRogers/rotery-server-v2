import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UserRating } from 'src/entities/user-rating';
import { UsersService } from '../users/users.service';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';

@Injectable()
export class UserRatingsService {
  constructor(
    @InjectRepository(UserRating)
    private userRatingsRepository: EntityRepository<UserRating>,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async create(userId: number, createUserRatingDto: CreateUserRatingDto) {
    try {
      const user = await this.usersService.findOne({ id: userId });
      const newRating = new UserRating({
        user: 'id' in user && user,
        ...createUserRatingDto,
      });
      await this.userRatingsRepository.persistAndFlush(newRating);

      return newRating;
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }
}
