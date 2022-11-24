import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { GuideUserLocationsServiceInterface } from './interfaces/guide-user-locations-service.interface';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GuideUserLocationsProvider } from './enums/guide-user-locations-provider';

@UseGuards(JwtAuthGuard)
@Controller('guide-locations')
export class GuideUserLocationsController {
  constructor(
    @Inject(GuideUserLocationsProvider.GUIDE_USER_LOCATIONS_SERVICE)
    private readonly guideUserLocationService: GuideUserLocationsServiceInterface,
  ) {}

  @Post('/join/:locationId')
  @HttpCode(201)
  async joinLocation(
    @Req() request: RequestUser,
    @Param() params: { locationId: number },
  ) {
    return await this.guideUserLocationService.add(
      request.user.userId,
      params.locationId,
    );
  }

  @Delete('/leave/:locationId')
  @HttpCode(201)
  async leaveLocation(
    @Req() request: RequestUser,
    @Param() params: { locationId: number },
  ) {
    return await this.guideUserLocationService.remove(
      request.user.userId,
      params.locationId,
    );
  }

  @Get('/:locationId')
  @HttpCode(201)
  async findGuidesByLocation(@Param() params: { locationId: number }) {
    return await this.guideUserLocationService.listAll(params.locationId);
  }
}
