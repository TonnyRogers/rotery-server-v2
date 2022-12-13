import { ResetPassword } from '@/entities/reset-password.entity';

export interface RemoveResetPasswordQueryParam {
  id?: number;
  user?: number;
}

export interface FindOneResetPasswordQueryParam {
  id?: number;
  user?: number;
  code?: string;
}

export interface ResetPasswordRepositoryInterface {
  create(entity: ResetPassword): Promise<void>;
  delete(findQuery: RemoveResetPasswordQueryParam): Promise<void>;
  findOne(findQuery: FindOneResetPasswordQueryParam): Promise<ResetPassword>;
}
