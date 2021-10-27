import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../../utils/password';
import { User } from '../../entities/user.entity';
import { UsersService } from '../users/users.service';

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
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
