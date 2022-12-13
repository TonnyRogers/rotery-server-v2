import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { ResetPassword } from '@/entities/reset-password.entity';

import {
  FindOneResetPasswordQueryParam,
  RemoveResetPasswordQueryParam,
  ResetPasswordRepositoryInterface,
} from './interfaces/reset-password-repository.interface';

export class ResetPasswordRepository
  implements ResetPasswordRepositoryInterface
{
  constructor(
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: EntityRepository<ResetPassword>,
  ) {}

  async create(entity: ResetPassword): Promise<void> {
    await this.resetPasswordRepository.nativeInsert(entity);
  }

  async findOne(
    findQuery: FindOneResetPasswordQueryParam,
  ): Promise<ResetPassword> {
    const reset = await this.resetPasswordRepository.findOne(findQuery);

    return reset;
  }

  async delete(findQuery: RemoveResetPasswordQueryParam): Promise<void> {
    await this.resetPasswordRepository.nativeDelete(findQuery);
  }
}
