import { Provider } from '@nestjs/common';

import { LocationsService } from '../locations.service';

import { LocationsProvider } from '../enums/locations-provider.enum';
import { LocationActivityRepository } from '../repositories/location-activity.respository';
import { LocationLodgingRepository } from '../repositories/location-lodging.respository';
import { LocationPhotoRepository } from '../repositories/location-photo.respository';
import { LocationTransportRepository } from '../repositories/location-transport.respository';
import { LocationsRepository } from '../repositories/locations.repository';

export const locationsProvider: Provider[] = [
  {
    provide: LocationsProvider.LOCATION_SERVICE,
    useClass: LocationsService,
  },
  {
    provide: LocationsProvider.LOCATION_REPOSITORY,
    useClass: LocationsRepository,
  },
  {
    provide: LocationsProvider.LOCATION_ACTIVITY_REPOSITORY,
    useClass: LocationActivityRepository,
  },
  {
    provide: LocationsProvider.LOCATION_LODGING_REPOSITORY,
    useClass: LocationLodgingRepository,
  },
  {
    provide: LocationsProvider.LOCATION_PHOTO_REPOSITORY,
    useClass: LocationPhotoRepository,
  },
  {
    provide: LocationsProvider.LOCATION_TRANSPORT_REPOSITORY,
    useClass: LocationTransportRepository,
  },
];
