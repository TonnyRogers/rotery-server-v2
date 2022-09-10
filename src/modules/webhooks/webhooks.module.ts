import { Module } from '@nestjs/common';

import { ItineraryMembersModule } from '../itinerary-members/itinerary-members.module';
import { PaymentModule } from '../payments/payments.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { TipsModule } from '../tips/tips.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  controllers: [WebhooksController],
  imports: [
    PaymentModule,
    ItineraryMembersModule,
    SubscriptionsModule,
    TipsModule,
  ],
})
export class WebhooksModule {}
