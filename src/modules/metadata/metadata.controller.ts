import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';

import { MetadataServiceInterface } from './interfaces/metadata-service.interface';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MetadataProvider } from './enums/metadata-providers.enum';

@UseGuards(JwtAuthGuard)
@Controller('metadata')
export class MetadataController {
  constructor(
    @Inject(MetadataProvider.METADATA_SERVICE)
    private readonly metadataService: MetadataServiceInterface,
  ) {}

  @Get('backpacker-welcome')
  async getBackpackerWelcomeData(@Req() request: RequestUser) {
    return await this.metadataService.backpackerWelcome(request.user.userId);
  }

  @Get('guide-welcome')
  async getGuideWelcomeData(@Req() request: RequestUser) {
    return await this.metadataService.guideWelcome(request.user.userId);
  }
}
