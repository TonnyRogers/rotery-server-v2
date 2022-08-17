import { GuideUserLocation } from '@/entities/guide-user-location.entity';

export interface GuideUserLocationsRepositoryInterface {
  create(entity: any): Promise<GuideUserLocation>;
  delete(filters: { user: number; location: number }): Promise<void>;
  findAll(filters: { location: number }): Promise<GuideUserLocation[]>;
  count(filters: { user: number; location: number }): Promise<number>;
}
