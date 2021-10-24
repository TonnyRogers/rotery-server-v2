import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Injectable } from '@nestjs/common';
import { Activity } from '../../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: EntityRepository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    try {
      const exists = await this.findOne(createActivityDto.name);

      if (exists) {
        throw new HttpException('This activity already exists.', 401);
      }

      const newActivity = new Activity(createActivityDto);
      await this.activityRepository.persistAndFlush(newActivity);

      return newActivity;
    } catch (error) {
      throw new HttpException('Fail on create new activity.', 400);
    }
  }

  async findAll() {
    try {
      return this.activityRepository.findAll();
    } catch (error) {
      throw new HttpException('Error on list activities.', 400);
    }
  }

  async findOne(languageName: string) {
    try {
      return this.activityRepository.findOneOrFail({ name: languageName });
    } catch (error) {
      throw new HttpException('Error on list activities.', 400);
    }
  }
}
