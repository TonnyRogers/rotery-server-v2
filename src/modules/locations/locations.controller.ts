import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import {
  GetLocationQueryFilter,
  LocationsServiceInterface,
} from './interfaces/service-interface';

import { Location } from '@/entities/location.entity';
import { ParamId } from '@/utils/types';

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
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.add(createLocationDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Location, isArray: false })
  @Put(':id')
  updateLocation(
    @Param() param: ParamId,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(param.id, updateLocationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeLocation(@Param() param: ParamId) {
    return this.locationsService.remove(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/feed')
  locationsFeed(@Query() query: GetLocationFeedQueryFilter) {
    return this.locationsService.getFeed(query);
  }
}
