import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Lodging } from '../../entities/lodging.entity';
import { LodgingController } from './lodgings.controller';
import { LodgingsService } from './lodgings.service';

@Module({
  imports: [MikroOrmModule.forFeature([Lodging])],
  controllers: [LodgingController],
  providers: [LodgingsService],
  exports: [LodgingsService],
})
export class LodgingsModule {}
