import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Tip } from '@/entities/tip.entity';
import { User } from '@/entities/user.entity';

import { tipsProvider } from './providers';
import { TipsController } from './tips.controller';

@Module({
  controllers: [TipsController],
  imports: [MikroOrmModule.forFeature([Tip, User])],
  providers: tipsProvider,
  exports: tipsProvider,
})
export class TipsModule {}
