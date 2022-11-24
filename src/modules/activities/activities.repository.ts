import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Activity } from '@/entities/activity.entity';

import {
  ActivitiesRepositoryInterface,
  FindOneActivityRespositoryParams,
} from './interfaces/activities-repository.interface';

export class ActivitiesRepository implements ActivitiesRepositoryInterface {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: EntityRepository<Activity>,
  ) {}

  async findOne(filters: FindOneActivityRespositoryParams): Promise<Activity> {
    return this.activityRepository.findOne(filters);
  }

  async findAll(): Promise<Activity[]> {
    return this.activityRepository.findAll();
  }

  async create(entity: Activity): Promise<Activity> {
    const newActivity = this.activityRepository.create(entity);

    await this.activityRepository.persistAndFlush(newActivity);

    return newActivity;
  }
}
