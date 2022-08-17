import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ParamId, RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { UserRatingsProvider } from './enums/user-ratings-providers.enum';
import { UserRatingsServiceInterface } from './interfaces/user-ratings-repository.interface';

@UseGuards(JwtAuthGuard)
@Controller('user-ratings')
export class UserRatingsController {
  constructor(
    @Inject(UserRatingsProvider.USER_RATINGS_SERVICE)
    private userRatingService: UserRatingsServiceInterface,
  ) {}

  @Post('/:id')
  async rateUser(
    @Req() request: RequestUser,
    @Param() params: ParamId,
    @Body() createRatingDto: CreateUserRatingDto,
  ) {
    return this.userRatingService.create(
      request.user.userId,
      params.id,
      createRatingDto,
    );
  }

  @Get('/by-owner')
  async ratingsByOwner(@Req() request: RequestUser) {
    return this.userRatingService.findAllByOwner(request.user.userId);
  }
}
