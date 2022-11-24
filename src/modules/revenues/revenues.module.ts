import { Module } from '@nestjs/common';

import { RevenuesService } from './revenues.service';

import { TipsModule } from '../tips/tips.module';
import { RevenuesController } from './revenues.controller';

@Module({
  controllers: [RevenuesController],
  imports: [TipsModule],
  providers: [RevenuesService],
})
export class RevenuesModule {}
