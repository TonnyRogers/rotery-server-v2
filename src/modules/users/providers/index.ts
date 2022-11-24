import { Provider } from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';

import { UsersService } from '../users.service';

import { User } from '@/entities/user.entity';

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
  {
    provide: User,
    useClass: EntityRepository<User>,
  },
];
