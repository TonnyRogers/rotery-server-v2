import { Provider } from "@nestjs/common";
import { LocationsProvider } from "../enums/locations-provider.enum";
import { LocationsRepository } from "../locations.repository";
import { LocationsService } from "../locations.service";

export const locationsProvider: Provider[] = [
  {
    provide: LocationsProvider.LOCATION_SERVICE,
    useClass: LocationsService,
  },
  { 
    provide: LocationsProvider.LOCATION_REPOSITORY,
    useClass: LocationsRepository,
  }
]