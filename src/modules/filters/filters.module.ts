import { Module } from '@nestjs/common';

import { LocationsModule } from '../locations/locations.module';
import { FiltersController } from './filters.controller';
import { filterProvider } from './providers';

@Module({
  controllers: [FiltersController],
  imports: [LocationsModule],
  providers: filterProvider,
})
export class FiltersModule {}
