import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { dayjsPlugins } from '@/providers/dayjs-config';
import { comparePassword } from '@/utils/password';

import { User, UserRole } from '../../entities/user.entity';

export type JWTEncryptedData = {
  username: string;
  sub: number;
  role: UserRole;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findAndValidate({ email });

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

  async login(user: Omit<User, 'password'>) {
    // insert things to jwt encrypt
    const payload: JWTEncryptedData = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const encoded = this.jwtService.sign(payload);
    return {
      access_token: encoded,
      user,
      expires: dayjsPlugins().add(1, 'minute').valueOf(),
    };
  }
}
