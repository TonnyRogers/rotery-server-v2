import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ResetPasswordsService } from './reset-passwords.service';

import { ResetPassword } from '../../entities/reset-password.entity';
import { UsersModule } from '../users/users.module';
import { resetPasswordProviders } from './providers';
import { ResetPasswordsController } from './reset-passwords.controller';

@Module({
  controllers: [ResetPasswordsController],
  providers: resetPasswordProviders,
  imports: [MikroOrmModule.forFeature([ResetPassword]), UsersModule],
})
export class ResetPasswordsModule {}
