import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ParamId } from '@/utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserRatingDto } from './dto/create-user-rating.dto';
import { UserRatingsService } from './user-ratings.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserRatingsController {
  constructor(
    @Inject(UserRatingsService)
    private userRatingService: UserRatingsService,
  ) {}

  @Post('/:id/rate')
  async rateUser(
    @Param() params: ParamId,
    @Body() createRatingDto: CreateUserRatingDto,
  ) {
    return this.userRatingService.create(params.id, createRatingDto);
  }
}
