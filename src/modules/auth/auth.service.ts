import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Response } from 'express';

import {
  AuthServiceInterface,
  LoginResponse,
} from './interfaces/auth-service.interface';

import { RefreshToken, RefreshType } from '@/entities/refresh-token.entity';
import { dayjsPlugins } from '@/providers/dayjs-config';
import { hashRefresh } from '@/utils/jwt-hash';
import { comparePassword } from '@/utils/password';

import { User, UserRole } from '../../entities/user.entity';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { UsersRepositoryInterface } from '../users/interfaces/users-repository.interface';
import { AuthProvider } from './enums/auth-provider.enum';
import { RefreshTokenRepositoryInterface } from './interfaces/refresh-token-repository.interface';

export type JWTEncryptedData = {
  username: string;
  sub: number;
  role: UserRole;
};

const DAYS_100 = 120 * 1000;

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(AuthProvider.JWT_SERVICE)
    private jwtService: JwtService,
    @Inject(UsersProvider.USERS_REPOSITORY)
    private usersRepository: UsersRepositoryInterface,
    @Inject(AuthProvider.REFRESH_TOKEN_REPOSITORY)
    private refreshTokenRepository: RefreshTokenRepositoryInterface,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersRepository.findAndValidate({ email });

    if (
      user &&
      'username' in user &&
      (await comparePassword(pass, user.password))
    ) {
      delete user.password;
      delete user.deviceToken;
      return user;
    }
    return null;
  }

  async login(
    user: Omit<User, 'password'>,
    res: Response,
  ): Promise<LoginResponse> {
    // insert things to jwt encrypt
    const payload: JWTEncryptedData = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const encoded = this.jwtService.sign(payload);
    const refreshToken = await hashRefresh();
    const newRefresh = new RefreshToken({
      user: user as User,
      token: refreshToken,
      expiresAt: dayjsPlugins().add(100, 'days').toDate(),
      type: RefreshType.MOBILE,
    });

    const existedToken = await this.refreshTokenRepository.find({
      user: user.id,
      type: RefreshType.MOBILE,
    });

    if (existedToken) {
      await this.refreshTokenRepository.update(
        {
          expiresAt: newRefresh.expiresAt,
          token: newRefresh.token,
          userId: newRefresh.user.id,
          type: newRefresh.type,
        },
        false,
      );
    } else {
      await this.refreshTokenRepository.create(newRefresh, false);
    }

    res.cookie('rfh', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: DAYS_100,
    });

    return {
      access_token: encoded,
      user,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<Omit<LoginResponse, 'user'>> {
    const validRefresh = await this.refreshTokenRepository.find({
      token: refreshToken,
    });

    if (!validRefresh) {
      throw new HttpException(
        'Invalid Refresh Token.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const nowDate = dayjsPlugins();
    const expireDate = dayjsPlugins(validRefresh.expiresAt);

    if (nowDate.isAfter(expireDate)) {
      throw new HttpException(
        'Invalid Refresh Token.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: JWTEncryptedData = {
      username: validRefresh.user.username,
      sub: validRefresh.user.id,
      role: validRefresh.user.role,
    };

    const encoded = this.jwtService.sign(payload);

    return {
      access_token: encoded,
    };
  }

  async logout(deviceToken?: string): Promise<void> {
    const user = await this.usersRepository.findOne({ deviceToken });

    if (user) {
      await this.usersRepository.setDeviceToken(user.id, null);
    }
  }
}
