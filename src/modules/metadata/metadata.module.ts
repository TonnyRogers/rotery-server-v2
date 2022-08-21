import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Chat } from '@/entities/chat.entity';
import { LocationRating } from '@/entities/location-rating';
import { UserRating } from '@/entities/user-rating';
import { User } from '@/entities/user.entity';

import { MetadataController } from './metadata.controller';
import { metadataProvider } from './providers';

@Module({
  controllers: [MetadataController],
  imports: [
    MikroOrmModule.forFeature([LocationRating, UserRating, User, Chat]),
  ],
  providers: metadataProvider,
})
export class MetadataModule {}
