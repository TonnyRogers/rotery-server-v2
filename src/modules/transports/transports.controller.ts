import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import { TransportsService } from './transports.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransportDto } from './dto/create-transport.dto';

@Controller('transports')
export class TransportsController {
  constructor(
    @Inject(TransportsService)
    private transportsService: TransportsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async newTransport(@Body() createTransportDto: CreateTransportDto) {
    return this.transportsService.create(createTransportDto);
  }

  @Get()
  async listAll() {
    return this.transportsService.findAll();
  }
}
