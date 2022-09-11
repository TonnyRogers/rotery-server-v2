import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { FeedItinerariesService } from './feed-itineraries.service';

import { ParamId, RequestUser } from '@/utils//types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('feed')
export class FeedItinerariesController {
  constructor(
    @Inject(FeedItinerariesService)
    private feedItinerariesService: FeedItinerariesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async feed(@Req() request: RequestUser, @Query() filter: any) {
    return this.feedItinerariesService.findAll(request.user.userId, filter);
  }

  @Get(':id')
  async feedDetails(@Param() params: ParamId) {
    return this.feedItinerariesService.findOne(params.id);
  }
}
