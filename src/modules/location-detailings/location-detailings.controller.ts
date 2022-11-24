import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LocationDetailingServiceInterface } from './interfaces/location-detailings-service.interface';

import { UserRole } from '@/entities/user.entity';
import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLocationDetailingsDto } from './dto/create-location-detailings.dto';
import { DeleteLocationDetailingsDto } from './dto/delete-location-detailings.dto';
import { UpdateLocationDetailingsDto } from './dto/update-location-detailings.dto';
import { LocationDetailingsProvider } from './enums/location-detailings-provider.enum';

@Controller('location-detailings')
export class LocationDetailingController {
  constructor(
    @Inject(LocationDetailingsProvider.LOCATION_DETAILING_SERVICE)
    private readonly locationDetailingsService: LocationDetailingServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':locationId')
  async newLocationDetailing(
    @Req() request: RequestUser,
    @Param() params: { locationId: number },
    @Body() createLocationDetailingDto: CreateLocationDetailingsDto,
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.locationDetailingsService.add(
      params.locationId,
      createLocationDetailingDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':locationId')
  async updateLocationDetailing(
    @Req() request: RequestUser,
    @Param() params: { locationId: number },
    @Body() updateLocationDetailingDto: UpdateLocationDetailingsDto,
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.locationDetailingsService.update(
      params.locationId,
      updateLocationDetailingDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':locationId')
  async removeLocationDetailing(
    @Req() request: RequestUser,
    @Param() params: { locationId: number },
    @Body() deleteLocationDetailingDto: DeleteLocationDetailingsDto,
  ) {
    if (request.user.role !== UserRole.MASTER) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.locationDetailingsService.remove(
      params.locationId,
      deleteLocationDetailingDto,
    );
  }
}
