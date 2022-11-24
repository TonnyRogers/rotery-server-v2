import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FilesService } from './files.service';

import { File } from '../../entities/file.entity';
import { FilesController } from './files.controller';
import { filesProvider } from './providers';

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: filesProvider,
  exports: filesProvider,
})
export class FilesModule {}
