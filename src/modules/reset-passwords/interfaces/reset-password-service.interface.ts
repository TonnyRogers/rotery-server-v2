import { Loaded } from '@mikro-orm/core';

import { ResetPassword } from '@/entities/reset-password.entity';

import { NewPasswordDto } from '../dto/new-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export interface ResetPasswordServiceInterface {
  create(resetPasswordDto: ResetPasswordDto): Promise<void>;
  findOne(
    code: number,
    returnEntity?: boolean,
  ): Promise<
    | Loaded<ResetPassword, never>
    | {
        message: string;
        statusCode: number;
      }
  >;
  reset(
    code: number,
    newPasswordDto: NewPasswordDto,
  ): Promise<{
    message: string;
    statusCode: number;
  }>;
}
