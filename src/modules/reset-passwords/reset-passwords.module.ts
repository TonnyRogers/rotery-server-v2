import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ResetPasswordsService } from './reset-passwords.service';

import { ResetPassword } from '../../entities/reset-password.entity';
import { UsersModule } from '../users/users.module';
import { ResetPasswordsController } from './reset-passwords.controller';

@Module({
  controllers: [ResetPasswordsController],
  providers: [ResetPasswordsService],
  imports: [MikroOrmModule.forFeature([ResetPassword]), UsersModule],
})
export class ResetPasswordsModule {}
