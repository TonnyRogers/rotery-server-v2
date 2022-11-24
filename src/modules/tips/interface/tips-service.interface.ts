import { Response } from 'express';

import { Tip } from '@/entities/tip.entity';
import { PaymentDetailStatus } from '@/utils/types';

import { CreateTipDto } from '../dto/create-tip.dto';

export interface TipsServiceInterface {
  add(authUserId: number, dto: CreateTipDto): Promise<Tip>;
  getByPayer(authUserId: number): Promise<Tip[]>;
  getByCollector(authUserId: number): Promise<Tip[]>;
  updateByWebhook(
    paymentId: string,
    paymentStatus: PaymentDetailStatus,
    res: Response,
  ): Promise<Response<any, Record<string, any>>>;
}
