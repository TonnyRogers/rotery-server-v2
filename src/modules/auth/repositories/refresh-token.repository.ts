import { UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { RefreshToken, RefreshType } from '@/entities/refresh-token.entity';
import { User } from '@/entities/user.entity';

import {
  RefreshTokenFindParams,
  RefreshTokenRepositoryInterface,
  RefreshTokenUpdatePayload,
} from '../interfaces/refresh-token-repository.interface';

export class RefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
  ) {}

  async create(entity: RefreshToken, needResult = true): Promise<RefreshToken> {
    const queryBuilder = this.refreshTokenRepository.createQueryBuilder();
    await queryBuilder
      .insert({ ...entity, user: entity.user.id })
      .execute('get');

    if (needResult) {
      const newRefresh = await queryBuilder
        .select(['*'])
        .where({ user: entity.user.id, type: entity.type })
        .execute('get');

      return newRefresh;
    }
  }

  async find(filter: RefreshTokenFindParams): Promise<RefreshToken> {
    const queryBuilder = this.refreshTokenRepository.createQueryBuilder('rt');

    const newRefresh: any = await queryBuilder
      .select([
        'rt.*',
        'user.id as user__id',
        'user.username as user__username',
        'user.role as user__role',
      ])
      .leftJoin('rt.user', 'user')
      .where(filter)
      .execute('get');

    if (!newRefresh) {
      return null;
    }

    return {
      expiresAt: newRefresh.expiresAt,
      token: newRefresh.token,
      type: newRefresh.type,
      updatedAt: newRefresh.updatedAt,
      user: {
        id: newRefresh['user__id'],
        role: newRefresh['user__role'],
        username: newRefresh['user__username'],
      } as User,
    };
  }

  async update(
    payload: RefreshTokenUpdatePayload,
    needResult = true,
  ): Promise<RefreshToken> {
    const queryBuilder = this.refreshTokenRepository.createQueryBuilder();
    await queryBuilder
      .update({
        token: payload.token,
        expiresAt: payload.expiresAt,
      })
      .where({
        user: payload.userId,
        type: payload.type,
      })
      .execute('get');

    if (needResult) {
      const newRefresh = await this.find({
        user: payload.userId,
        type: payload.type,
      });

      return newRefresh;
    }
  }

  async delete(userId: number, type: RefreshType): Promise<void> {
    const queryBuilder = this.refreshTokenRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({
        user: userId,
        type,
      })
      .execute();
  }
}
