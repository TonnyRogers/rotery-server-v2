import { RefreshToken, RefreshType } from '@/entities/refresh-token.entity';

export type RefreshTokenUpdatePayload = {
  userId: number;
  type: RefreshType;
  token: string;
  expiresAt: Date;
};

export type RefreshTokenFindParams = {
  user?: number;
  token?: string;
  type?: RefreshType;
};

export interface RefreshTokenRepositoryInterface {
  find(filter: RefreshTokenFindParams): Promise<RefreshToken>;
  create(entity: RefreshToken, needResult?: boolean): Promise<RefreshToken>;
  update(
    payload: RefreshTokenUpdatePayload,
    needResult?: boolean,
  ): Promise<RefreshToken>;
  delete(userId: number, type: RefreshType): Promise<void>;
}
