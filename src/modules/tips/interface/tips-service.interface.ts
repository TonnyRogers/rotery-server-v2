import { Tip } from '@/entities/tip.entity';

import { CreateTipDto } from '../dto/create-tip.dto';

export interface TipsServiceInterface {
  add(authUserId: number, dto: CreateTipDto): Promise<Tip>;
  getByPayer(authUserId: number): Promise<Tip[]>;
  getByCollector(authUserId: number): Promise<Tip[]>;
}
