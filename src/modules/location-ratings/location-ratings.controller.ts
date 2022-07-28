import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LocationRatingsServiceInterface } from './interfaces/location-ratings-service.interface';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLocationRatingDto } from './dto/create-location-ratings.dto';
import { FindLocationRatingsDto } from './dto/find-location-ratings.dto';
import { UpdateLocationRatingDto } from './dto/update-location-ratings.dto';
import { LocationRatingsProvider } from './enums/location-ratings-provider.enum';

@UseGuards(JwtAuthGuard)
@Controller('location-ratings')
export class LocationRatingsController {
  constructor(
    @Inject(LocationRatingsProvider.LOCATION_RATINGS_SERVICE)
    private readonly locationRatingsService: LocationRatingsServiceInterface,
  ) {}

  @Get()
  async getLocationRating(@Query() query: FindLocationRatingsDto) {
    return this.locationRatingsService.getOne(query);
  }

  @Post(':locationId')
  async newLocationRating(
    @Param() param: { locationId: number },
    @Body() createDto: CreateLocationRatingDto,
    @Req() request: RequestUser,
  ) {
    return this.locationRatingsService.add(
      request.user.userId,
      param.locationId,
      createDto,
    );
  }

  @Put(':locationId')
  async updateLocationRating(
    @Param() param: { locationId: number },
    @Body() updateDto: UpdateLocationRatingDto,
    @Req() request: RequestUser,
  ) {
    return this.locationRatingsService.update(
      request.user.userId,
      param.locationId,
      updateDto,
    );
  }
}
