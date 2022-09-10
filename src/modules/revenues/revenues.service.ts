import { Inject, Injectable } from '@nestjs/common';

import { TipsServiceInterface } from '../tips/interface/tips-service.interface';

import { Tip, TipPaymentStatus } from '@/entities/tip.entity';

import { TipsProvider } from '../tips/enums/tips-providers.enum';

@Injectable()
export class RevenuesService {
  constructor(
    @Inject(TipsProvider.TIPS_SERVICE)
    private tipsService: TipsServiceInterface,
  ) {}

  async listRevenues(authUserId: number): Promise<any> {
    const tips = await this.tipsService.getByCollector(authUserId);

    const tipAmount = tips.reduce(
      (acc, curr) =>
        curr.paymentStatus === TipPaymentStatus.PAID && !curr.paidAt
          ? (acc += Number(curr.paymentAmount))
          : (acc += 0),
      0,
    );

    return {
      revenues: tips,
      total: tipAmount,
    };
  }
}
