import { Provider } from '@nestjs/common';

import { TipsService } from '../tips.service';

import { UsersProvider } from '@/modules/users/enums/users-provider.enum';
import { UsersRepository } from '@/modules/users/users.repository';

import { TipsProvider } from '../enums/tips-providers.enum';
import { TipsRepository } from '../tips.repository';

export const tipsProvider: Provider[] = [
  {
    provide: TipsProvider.TIPS_SERVICE,
    useClass: TipsService,
  },
  {
    provide: TipsProvider.TIPS_REPOSITORY,
    useClass: TipsRepository,
  },
  {
    provide: UsersProvider.USERS_REPOSITORY,
    useClass: UsersRepository,
  },
];
