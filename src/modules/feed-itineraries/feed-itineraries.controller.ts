import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParamId } from 'utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeedItinerariesService } from './feed-itineraries.service';

@Controller('feed')
export class FeedItinerariesController {
  constructor(
    @Inject(FeedItinerariesService)
    private feedItinerariesService: FeedItinerariesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async feed(@Query() filter: any) {
    return this.feedItinerariesService.findAll(filter);
  }

  @Get(':id')
  async feedDetails(@Param() params: ParamId) {
    return this.feedItinerariesService.findOne(params.id);
  }
}
