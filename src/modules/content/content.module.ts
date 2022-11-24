import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ContentList } from '@/entities/content-list.entity';

import { FilesModule } from '../files/files.module';
import { ContentController } from './content.controller';
import { contentProvider } from './providers';

@Module({
  controllers: [ContentController],
  imports: [MikroOrmModule.forFeature([ContentList]), FilesModule],
  providers: contentProvider,
})
export class ContentModule {}
