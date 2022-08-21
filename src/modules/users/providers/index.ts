import { Provider } from '@nestjs/common';

import { UsersService } from '../users.service';

import { UsersProvider } from '../enums/users-provider.enum';
import { UsersRepository } from '../users.repository';

export const usersProviders: Provider[] = [
  {
    provide: UsersProvider.USERS_REPOSITORY,
    useClass: UsersRepository,
  },
  {
    provide: UsersProvider.USERS_SERVICE,
    useClass: UsersService,
  },
];
