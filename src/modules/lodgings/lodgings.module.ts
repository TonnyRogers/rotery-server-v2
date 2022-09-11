import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { LodgingsService } from './lodgings.service';

import { Lodging } from '../../entities/lodging.entity';
import { LodgingController } from './lodgings.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Lodging])],
  controllers: [LodgingController],
  providers: [LodgingsService],
  exports: [LodgingsService],
})
export class LodgingsModule {}
