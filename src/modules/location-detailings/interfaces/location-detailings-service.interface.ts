import { LocationDetailing } from '@/entities/location-detailing.entity';

import { CreateLocationDetailingsDto } from '../dto/create-location-detailings.dto';
import { DeleteLocationDetailingsDto } from '../dto/delete-location-detailings.dto';
import { UpdateLocationDetailingsDto } from '../dto/update-location-detailings.dto';

export interface LocationDetailingServiceInterface {
  add(
    locationId: number,
    createLocationDetailingDto: CreateLocationDetailingsDto,
  ): Promise<LocationDetailing[]>;
  remove(locationId: number, query: DeleteLocationDetailingsDto): Promise<void>;
  update(
    locationId: number,
    updateLocationDetailingDto: UpdateLocationDetailingsDto,
  ): Promise<LocationDetailing>;
}
