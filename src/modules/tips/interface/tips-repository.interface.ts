import { Tip } from '@/entities/tip.entity';

export interface FindAllTipsRepositoryParams {
  payer?: number;
  user?: number;
}

export interface TipsRepositoryInterface {
  create(entity: Tip): Promise<Tip>;
  findAll(params: FindAllTipsRepositoryParams): Promise<Tip[]>;
}
