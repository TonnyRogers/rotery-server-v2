import { SubscriptionStatus } from '@/entities/subscription.entity';
import { Controller, Get, Inject, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { PaymentStatus } from 'src/entities/itinerary-member.entity';
import { PaymentWebhookPayloadResponse } from '@/utils/types';
import { ItineraryMembersService } from '../itinerary-members/itinerary-members.service';
import { PaymentService } from '../payments/payments.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller('hooks')
export class WebhooksController {
  constructor(
    @Inject(PaymentService)
    private paymentService: PaymentService,
    @Inject(ItineraryMembersService)
    private itineraryMemberService: ItineraryMembersService,
    @Inject(SubscriptionsService)
    private subscriptionsService: SubscriptionsService,
  ) {}

  @Post('payment')
  async paymentHook(@Req() req: Request, @Res() res: Response) {
    const payload: PaymentWebhookPayloadResponse = req.body;

    switch (payload.type) {
      case 'payment':
        const payment = await this.paymentService.getPaymentDetails(
          Number(payload.data.id),
        );

        if(payment.metadata?.payment_validator === 'checkout') {
          if (payment.status === 'approved') {
            const member = await this.itineraryMemberService.findByPaymentId(
              String(payment.id),
            );
  
            if (payment.status_detail === 'accredited') {
              return await this.itineraryMemberService.updatePaymentStatus(
                member.id,
                PaymentStatus.PAID,
                res,
                payment,
              );
            }
  
            if (payment.status_detail === 'partially_refunded') {
              return await this.itineraryMemberService.updatePaymentStatus(
                member.id,
                PaymentStatus.REFUNDED,
                res,
                payment,
              );
            }
          }
  
          if (payment.status === 'in_process') {
            const member = await this.itineraryMemberService.findByPaymentId(
              String(payment.id),
            );
  
            return await this.itineraryMemberService.updatePaymentStatus(
              member.id,
              PaymentStatus.PENDING,
              res,
              payment,
            );
          }
  
          if (payment.status === 'rejected') {
            const member = await this.itineraryMemberService.findByPaymentId(
              String(payment.id),
            );
  
            return await this.itineraryMemberService.updatePaymentStatus(
              member.id,
              PaymentStatus.REFUSED,
              res,
              payment,
            );
          }
  
          if (payment.status === 'refunded') {
            const member = await this.itineraryMemberService.findByPaymentId(
              String(payment.id),
            );
  
            return await this.itineraryMemberService.updatePaymentStatus(
              member.id,
              PaymentStatus.REFUNDED,
              res,
              payment,
            );
          }
  
          if (payment.status === 'cancelled') {
            const member = await this.itineraryMemberService.findByPaymentId(
              String(payment.id),
            );
  
            return await this.itineraryMemberService.updatePaymentStatus(
              member.id,
              PaymentStatus.REFUNDED,
              res,
              payment,
            );
          }
        } else {
          if (payment.status === 'approved') {
            return await this.subscriptionsService.updateSubscriptionStatusByWebhook(
              payment.payer.email,
              SubscriptionStatus.AUTHORIZED,
              res,
              payment,
            );
          }
    
          if (payment.status === 'rejected') {
            return await this.subscriptionsService.updateSubscriptionStatusByWebhook(
              payment.payer.email,
              SubscriptionStatus.NO_PAYMENT,
              res,
              payment,
            );
          }
    
          if (payment.status === 'refunded') {
            return await this.subscriptionsService.updateSubscriptionStatusByWebhook(
              payment.payer.email,
              SubscriptionStatus.PENDING,
              res,
              payment,
            );
          }
        }
        break;
      default:
        return res.status(200).send();
        break;
    }
  }
}
