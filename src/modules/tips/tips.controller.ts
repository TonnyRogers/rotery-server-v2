import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TipsServiceInterface } from './interface/tips-service.interface';

import { RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipsProvider } from './enums/tips-providers.enum';

@UseGuards(JwtAuthGuard)
@Controller('tips')
export class TipsController {
  constructor(
    @Inject(TipsProvider.TIPS_SERVICE)
    private readonly tipsService: TipsServiceInterface,
  ) {}

  @Post()
  async newTip(@Req() request: RequestUser, @Body() dto: CreateTipDto) {
    return this.tipsService.add(request.user.userId, dto);
  }

  @Get('by-payer')
  async allByPayer(@Req() request: RequestUser) {
    return this.tipsService.getByPayer(request.user.userId);
  }

  @Get('by-collector')
  async allByCollector(@Req() request: RequestUser) {
    return this.tipsService.getByCollector(request.user.userId);
  }
}
