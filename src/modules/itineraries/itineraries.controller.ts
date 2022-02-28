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
import { ParamId, RequestUser } from '@/utils//types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { ItinerariesService } from './itineraries.service';

@Controller('itineraries')
export class ItinerariesController {
  constructor(
    @Inject(ItinerariesService)
    private itinerariesService: ItinerariesService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  async inviteUser(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() inviteItineraryDto: { userId: number },
  ) {
    return this.itinerariesService.invite(
      request.user.userId,
      inviteItineraryDto.userId,
      params.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getItineraries(@Req() request: RequestUser) {
    return this.itinerariesService.findAll(request.user.userId);
  }

  @Get(':id/details')
  async getItinerary(@Param() params: ParamId) {
    return this.itinerariesService.show(params.id);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeItinerary(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.itinerariesService.delete(request.user.userId, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/finish')
  async finishItinerary(
    @Param() params: { id: number },
    @Req() request: RequestUser,
  ) {
    return this.itinerariesService.finish(request.user.userId, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateCreation(@Req() request: RequestUser) {
    return this.itinerariesService.createValidation(request.user.userId);
  }
}
