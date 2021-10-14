import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ResetPassword } from '../../entities/reset-password.entity';
import { UsersModule } from '../users/users.module';
import { ResetPasswordsController } from './reset-passwords.controller';
import { ResetPasswordsService } from './reset-passwords.service';

@Module({
  controllers: [ResetPasswordsController],
  providers: [ResetPasswordsService],
  imports: [MikroOrmModule.forFeature([ResetPassword]), UsersModule],
})
export class ResetPasswordsModule {}
