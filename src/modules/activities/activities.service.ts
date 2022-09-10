import { HttpException, Inject, Injectable } from '@nestjs/common';

import { ActivitiesServiceInterface } from './interfaces/activities-service.interface';

import { Activity } from '../../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivitiesProviders } from './enums/activities-provider.enum';
import { ActivitiesRepositoryInterface } from './interfaces/activities-repository.interface';

@Injectable()
export class ActivitiesService implements ActivitiesServiceInterface {
  constructor(
    @Inject(ActivitiesProviders.ACTIVITIES_REPOSITORY)
    private activityRepository: ActivitiesRepositoryInterface,
  ) {}

  async add(createActivityDto: CreateActivityDto) {
    const exists = await this.findOne(createActivityDto.name);

    if (exists) {
      throw new HttpException('This activity already exists.', 401);
    }

    const newActivity = new Activity(createActivityDto);
    return await this.activityRepository.create(newActivity);
  }

  async findAll() {
    return this.activityRepository.findAll();
  }

  async findOne(activityName: string) {
    return this.activityRepository.findOne({ name: activityName });
  }
}
