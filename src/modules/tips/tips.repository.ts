import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { Tip, TipPaymentStatus } from '@/entities/tip.entity';

import {
  FindAllTipsRepositoryParams,
  TipsRepositoryInterface,
} from './interface/tips-repository.interface';

export class TipsRepository implements TipsRepositoryInterface {
  constructor(
    @InjectRepository(Tip)
    private readonly tipRepository: EntityRepository<Tip>,
  ) {}

  async create(entity: Tip): Promise<Tip> {
    const newEntity = this.tipRepository.create(entity);
    await this.tipRepository.persistAndFlush(newEntity);
    return newEntity;
  }

  async findAll(params: FindAllTipsRepositoryParams): Promise<Tip[]> {
    return this.tipRepository.find(
      { ...params },
      { populate: ['paymentAmount', 'payer'] },
    );
  }

  async findByPaymentId(paymentId: string): Promise<Tip> {
    return this.tipRepository.findOne({ paymentId });
  }

  async updateStatus(id: string, status: TipPaymentStatus): Promise<Tip> {
    await this.tipRepository.nativeUpdate(
      { id: id },
      { paymentStatus: status },
    );

    return this.tipRepository.findOne({ id });
  }
}
