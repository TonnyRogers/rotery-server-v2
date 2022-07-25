import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { LocationDetailingServiceInterface } from './interfaces/location-detailings-service.interface';

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
    @Param() params: { locationId: number },
    @Body() createLocationDetailingDto: CreateLocationDetailingsDto,
  ) {
    return this.locationDetailingsService.add(
      params.locationId,
      createLocationDetailingDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':locationId')
  async updateLocationDetailing(
    @Param() params: { locationId: number },
    @Body() updateLocationDetailingDto: UpdateLocationDetailingsDto,
  ) {
    return this.locationDetailingsService.update(
      params.locationId,
      updateLocationDetailingDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':locationId')
  async removeLocationDetailing(
    @Param() params: { locationId: number },
    @Body() deleteLocationDetailingDto: DeleteLocationDetailingsDto,
  ) {
    return this.locationDetailingsService.remove(
      params.locationId,
      deleteLocationDetailingDto,
    );
  }
}
