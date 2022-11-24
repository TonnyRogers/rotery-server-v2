import { Activity } from '@/entities/activity.entity';

import { CreateActivityDto } from '../dto/create-activity.dto';

export interface ActivitiesServiceInterface {
  add(createActivityDto: CreateActivityDto): Promise<Activity>;
  findAll(): Promise<Activity[]>;
  findOne(activityName: string): Promise<Activity>;
}
