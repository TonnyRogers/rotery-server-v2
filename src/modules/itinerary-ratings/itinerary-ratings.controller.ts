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
import { CreateItineraryRatingDto } from './dto/create-itinerary-rating.dto';
import { ItinerariesRatingsService } from './itinerary-ratings.service';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItinerariesRatingsController {
  constructor(
    @Inject(ItinerariesRatingsService)
    private ItinerariesRatingService: ItinerariesRatingsService,
  ) {}

  @Post('/:id/rate')
  async rateItineraries(
    @Param() params: ParamId,
    @Body() createRatingDto: CreateItineraryRatingDto,
  ) {
    return this.ItinerariesRatingService.create(params.id, createRatingDto);
  }
}
