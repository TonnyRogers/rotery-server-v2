import { User } from '@/entities/user.entity';

export interface UsersRepositoryInterface {
  findOne(
    filters: { id?: number; email?: string },
    populate?: any[],
  ): Promise<User>;
}
