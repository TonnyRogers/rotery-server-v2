import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Transport } from '../../entities/transport.entity';
import { TransportsController } from './transports.controller';
import { TransportsService } from './transports.service';

@Module({
  controllers: [TransportsController],
  providers: [TransportsService],
  imports: [MikroOrmModule.forFeature([Transport])],
  exports: [TransportsService],
})
export class TransportsModule {}
