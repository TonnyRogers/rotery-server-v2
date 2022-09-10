import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import { ActivitiesServiceInterface } from './interfaces/activities-service.interface';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivitiesProviders } from './enums/activities-provider.enum';

@Controller('activities')
export class ActivitiesController {
  constructor(
    @Inject(ActivitiesProviders.ACTIVITIES_SERVICE)
    private activitiesService: ActivitiesServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async newActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.add(createActivityDto);
  }

  @Get()
  async listAll() {
    return this.activitiesService.findAll();
  }
}
