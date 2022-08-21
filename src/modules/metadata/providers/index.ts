import { Provider } from '@nestjs/common';

import { MetadataService } from '../metadata.service';

import { ChatRepository } from '@/modules/chat/chat.respository';
import { ChatProvider } from '@/modules/chat/enums/chat-provider.enum';
import { LocationRatingsProvider } from '@/modules/location-ratings/enums/location-ratings-provider.enum';
import { LocationRatingsRepository } from '@/modules/location-ratings/location-ratings.repository';
import { UserRatingsProvider } from '@/modules/user-ratings/enums/user-ratings-providers.enum';
import { UserRatingsRepository } from '@/modules/user-ratings/user-ratings.repository';
import { UsersProvider } from '@/modules/users/enums/users-provider.enum';
import { UsersRepository } from '@/modules/users/users.repository';

import { MetadataProvider } from '../enums/metadata-providers.enum';

export const metadataProvider: Provider[] = [
  {
    provide: MetadataProvider.METADATA_SERVICE,
    useClass: MetadataService,
  },
  {
    provide: LocationRatingsProvider.LOCATION_RATINGS_REPOSITORY,
    useClass: LocationRatingsRepository,
  },
  {
    provide: UserRatingsProvider.USER_RATINGS_REPOSITORY,
    useClass: UserRatingsRepository,
  },
  {
    provide: UsersProvider.USERS_REPOSITORY,
    useClass: UsersRepository,
  },
  {
    provide: ChatProvider.CHAT_REPOSITORY,
    useClass: ChatRepository,
  },
];
