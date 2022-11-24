import { Tip, TipPaymentStatus } from '@/entities/tip.entity';

export interface FindAllTipsRepositoryParams {
  payer?: number;
  user?: number;
}

export interface TipsRepositoryInterface {
  create(entity: Tip): Promise<Tip>;
  findAll(params: FindAllTipsRepositoryParams): Promise<Tip[]>;
  findByPaymentId(paymentId: string): Promise<Tip>;
  updateStatus(id: string, status: TipPaymentStatus): Promise<Tip>;
}
