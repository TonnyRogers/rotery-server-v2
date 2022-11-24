import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { User } from '@/entities/user.entity';

import {
  UsersRepositoryInterface,
  FindAndValidateUserRepositoryFilter,
  FindUserRepositoryFilter,
} from './interfaces/users-repository.interface';

export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findOne(
    filters: FindUserRepositoryFilter,
    populate: any[] = ['profile.file'],
  ): Promise<User> {
    return this.userRepository.findOne(filters, {
      populate: populate,
    });
  }

  async update(id: number, payload: Partial<User>): Promise<User> {
    await this.userRepository.nativeUpdate({ id }, payload);

    return this.userRepository.findOne({ id });
  }

  async activateGuide(userId: number): Promise<any> {
    return await this.userRepository.nativeUpdate(
      {
        id: userId,
      },
      { canRelateLocation: true },
    );
  }

  async findAndValidate(
    filters: FindAndValidateUserRepositoryFilter,
  ): Promise<User> {
    const findOptions = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined || value !== null) {
        findOptions[key] = value;
      }
    });

    return await this.userRepository.findOne(findOptions, {
      populate: ['password'],
    });
  }

  async getDeviceToken(id: number): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder();

    return await queryBuilder
      .select(['id', 'device_token'])
      .where({ id: id })
      .execute('get');
  }

  async setDeviceToken(id: number, deviceToken: string | null): Promise<void> {
    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .update({ deviceToken: deviceToken })
      .where({
        id,
      })
      .execute();
  }
}
