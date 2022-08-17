import { GuideUserLocation } from '@/entities/guide-user-location.entity';

export interface GuideUserLocationsServiceInterface {
  add(authUserId: number, locationId: number): Promise<GuideUserLocation>;
  remove(authUserId: number, locationId: number): Promise<void>;
  listAll(locationId: number): Promise<GuideUserLocation[]>;
}
