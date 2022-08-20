import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { LocationRating } from '@/entities/location-rating';
import { UserRating } from '@/entities/user-rating';

import { MetadataController } from './metadata.controller';
import { metadataProvider } from './providers';

@Module({
  controllers: [MetadataController],
  imports: [MikroOrmModule.forFeature([LocationRating, UserRating])],
  providers: metadataProvider,
})
export class MetadataModule {}
