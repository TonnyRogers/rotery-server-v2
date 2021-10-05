import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestUser } from 'utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { ItinerariesService } from './itineraries.service';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItinerariesController {
  constructor(
    @Inject(ItinerariesService)
    private itinerariesService: ItinerariesService,
  ) {}

  @Post()
  async newItinerary(
    @Body() createItineraryDto: CreateItineraryDto,
    @Req() request: RequestUser,
  ) {
    return this.itinerariesService.create(
      request.user.userId,
      createItineraryDto,
    );
  }

  @Get()
  async getItineraries(@Req() request: RequestUser) {
    return this.itinerariesService.findAll(request.user.userId);
  }

  @Put(':id')
  async updateItinerary(
    @Param() params: { id: number },
    @Req() request: RequestUser,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itinerariesService.update(
      request.user.userId,
      params.id,
      updateItineraryDto,
    );
  }

  @Delete(':id')
  async removeItinerary(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.itinerariesService.delete(request.user.userId, params.id);
  }
}
