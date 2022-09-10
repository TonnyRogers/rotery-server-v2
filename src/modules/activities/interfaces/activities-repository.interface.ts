import { Activity } from '@/entities/activity.entity';

export interface FindOneActivityRespositoryParams {
  name: string;
}

export interface ActivitiesRepositoryInterface {
  findOne(filters: FindOneActivityRespositoryParams): Promise<Activity>;
  findAll(): Promise<Activity[]>;
  create(entity: Activity): Promise<Activity>;
}
