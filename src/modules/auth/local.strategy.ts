import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthServiceInterface } from './interfaces/auth-service.interface';

import { User } from '../../entities/user.entity';
import { AuthProvider } from './enums/auth-provider.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthProvider.AUTH_SERVICE)
    private authService: AuthServiceInterface,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Error on login.');
    }

    if (user.isActive !== true) {
      throw new UnauthorizedException('Inactive user, check your e-mail.');
    }

    return user;
  }
}
