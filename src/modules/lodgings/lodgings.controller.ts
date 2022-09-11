import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import { LodgingsService } from './lodgings.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLodgingDto } from './dto/create-lodging.dto';

@Controller('lodgings')
export class LodgingController {
  constructor(
    @Inject(LodgingsService)
    private lodgingsService: LodgingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async newLodging(@Body() createLodgingDto: CreateLodgingDto) {
    return this.lodgingsService.create(createLodgingDto);
  }

  @Get()
  async listAll() {
    return this.lodgingsService.findAll();
  }
}
