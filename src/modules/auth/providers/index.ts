import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth.service';

import { UsersProvider } from '@/modules/users/enums/users-provider.enum';
import { UsersRepository } from '@/modules/users/users.repository';

import { AuthProvider } from '../enums/auth-provider.enum';
import { JwtStrategy } from '../jwt.strategy';
import { LocalStrategy } from '../local.strategy';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

export const authProvider: Provider[] = [
  {
    provide: AuthProvider.AUTH_SERVICE,
    useClass: AuthService,
  },
  {
    provide: AuthProvider.LOCAL_STRATEGY,
    useClass: LocalStrategy,
  },
  {
    provide: AuthProvider.JWT_STRATEGY,
    useClass: JwtStrategy,
  },
  {
    provide: AuthProvider.REFRESH_TOKEN_REPOSITORY,
    useClass: RefreshTokenRepository,
  },
  {
    provide: AuthProvider.JWT_SERVICE,
    useExisting: JwtService,
  },
  {
    provide: UsersProvider.USERS_REPOSITORY,
    useClass: UsersRepository,
  },
];
