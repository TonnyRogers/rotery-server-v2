import { Location } from "@/entities/location.entity";
import { ParamId } from "@/utils/types";
import { Body, Controller, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { LocationsProvider } from "./enums/locations-provider.enum";
import { GetLocationQueryFilter, LocationsServiceInterface } from "./interfaces/service-interface";

@Controller('locations')
export class LocationsController {

  constructor(
    @Inject(LocationsProvider.LOCATION_SERVICE)
    private readonly locationsService: LocationsServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Location, isArray: true })
  @Get()
  getAllLocations(@Query() query: GetLocationQueryFilter) {
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
  updateLocation(@Param() param: ParamId, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(param.id,updateLocationDto);
  }

}