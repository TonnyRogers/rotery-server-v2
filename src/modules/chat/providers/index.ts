import { Provider } from '@nestjs/common';

import { ChatService } from '../chat.service';

import { ChatSocketGateway } from '../chat.gateway';
import { ChatRepository } from '../chat.respository';
import { ChatProvider } from '../enums/chat-provider.enum';

export const chatProvider: Provider[] = [
  {
    provide: ChatProvider.CHAT_SERVICE,
    useClass: ChatService,
  },
  {
    provide: ChatProvider.CHAT_GATEWAY,
    useClass: ChatSocketGateway,
  },
  {
    provide: ChatProvider.CHAT_REPOSITORY,
    useClass: ChatRepository,
  },
];
