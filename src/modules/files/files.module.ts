import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FilesService } from './files.service';

import { File } from '../../entities/file.entity';
import { FilesController } from './files.controller';

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
