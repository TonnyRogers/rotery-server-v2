import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { User } from '@/entities/user.entity';

import { UsersRepositoryInterface } from './interfaces/users-repository.interface';

export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findOne(
    filters: { id?: number; email?: string },
    populate: any[] = ['profile.file'],
  ): Promise<User> {
    return this.userRepository.findOne(filters, {
      populate: populate,
    });
  }
}
