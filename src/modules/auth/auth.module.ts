import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { RefreshToken } from '@/entities/refresh-token.entity';

import { jwtOptions } from '../../config';
import { User } from '../../entities/user.entity';
import { ProfileModule } from '../profiles/profile.module';
import { AuthController } from './auth.controller';
import { authProvider } from './providers';

@Module({
  controllers: [AuthController],
  imports: [
    MikroOrmModule.forFeature([User, RefreshToken]),
    PassportModule,
    JwtModule.register({
      secret: jwtOptions.secret,
      signOptions: { expiresIn: jwtOptions.expireTime },
    }),
    ProfileModule,
  ],
  providers: authProvider,
  exports: authProvider,
})
export class AuthModule {}
