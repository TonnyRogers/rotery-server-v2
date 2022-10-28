import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthService } from './auth.service';

import { jwtOptions } from '../../config';
import { User } from '../../entities/user.entity';
import { ProfileModule } from '../profiles/profile.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersModule,
    MikroOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtOptions.secret,
      signOptions: { expiresIn: '1m' },
    }),
    ProfileModule,
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
