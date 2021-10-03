import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(
    @Inject(ActivitiesService)
    private activitiesService: ActivitiesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async newActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  async listAll() {
    return this.activitiesService.findAll();
  }
}
