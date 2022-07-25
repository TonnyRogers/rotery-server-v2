import {
  LocationDetailing,
  LocationDetailingType,
} from '@/entities/location-detailing.entity';

import { UpdateLocationDetailingsDto } from '../dto/update-location-detailings.dto';

export interface LocationDetailingRepositoryInterface {
  create(entity: LocationDetailing): Promise<LocationDetailing>;
  update(
    locationId: number,
    dto: UpdateLocationDetailingsDto,
  ): Promise<LocationDetailing>;
  delete(filters: {
    locationId: number;
    type: LocationDetailingType;
  }): Promise<void>;
}
