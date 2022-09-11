import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { SubscriptionsService } from './subscriptions.service';

import { Plan } from '@/entities/plan.entity';
import { Subscription } from '@/entities/subscription.entity';

import { EmailsModule } from '../emails/emails.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsGateway } from './subscriptions.gateway';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsGateway],
  imports: [
    MikroOrmModule.forFeature([Plan, Subscription]),
    UsersModule,
    EmailsModule,
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
