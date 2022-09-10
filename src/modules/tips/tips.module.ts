import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Tip } from '@/entities/tip.entity';
import { User } from '@/entities/user.entity';

import { PaymentModule } from '../payments/payments.module';
import { tipsProvider } from './providers';
import { TipsController } from './tips.controller';

@Module({
  controllers: [TipsController],
  imports: [MikroOrmModule.forFeature([Tip, User]), PaymentModule],
  providers: tipsProvider,
  exports: tipsProvider,
})
export class TipsModule {}
