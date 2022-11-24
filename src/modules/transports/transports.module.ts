import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TransportsService } from './transports.service';

import { Transport } from '../../entities/transport.entity';
import { TransportsController } from './transports.controller';

@Module({
  controllers: [TransportsController],
  providers: [TransportsService],
  imports: [MikroOrmModule.forFeature([Transport])],
  exports: [TransportsService],
})
export class TransportsModule {}
