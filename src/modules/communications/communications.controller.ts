import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';

import { CommunicationsService } from './communications.service';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('communications')
export class CommunicationsController {
  constructor(
    @Inject(CommunicationsService)
    private communicationsService: CommunicationsService,
  ) {}

  @Post('/help')
  async requestHelp(
    @Req() request: RequestUser,
    @Body() createHelpRequestDto: CreateHelpRequestDto,
  ) {
    return this.communicationsService.requestHelp(
      request.user.userId,
      createHelpRequestDto,
    );
  }
}
