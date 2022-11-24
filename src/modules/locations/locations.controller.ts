import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import {
  GetLocationQueryFilter,
  LocationsServiceInterface,
} from './interfaces/service-interface';

import { Location } from '@/entities/location.entity';
import { UserRole } from '@/entities/user.entity';
import { ParamId, RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { GetLocationFeedQueryFilter } from './dto/get-feed-query-filter.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsProvider } from './enums/locations-provider.enum';

@Controller('locations')
export class LocationsController {
  constructor(
    @Inject(LocationsProvider.LOCATION_SERVICE)
    private readonly locationsService: LocationsServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Location, isArray: true })
  @Get()
  allLocations(@Query() query: GetLocationQueryFilter) {
    return this.locationsService.getAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Location, isArray: false })
  @Post()
  createLocation(
    @Req() request: RequestUser,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.locationsService.add(createLocationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Location, isArray: false })
  @Put(':id')
  updateLocation(
    @Req() request: RequestUser,
    @Param() param: ParamId,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.locationsService.update(param.id, updateLocationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeLocation(@Req() request: RequestUser, @Param() param: ParamId) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.locationsService.remove(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/feed')
  locationsFeed(@Query() query: GetLocationFeedQueryFilter) {
    return this.locationsService.getFeed(query);
  }
}
