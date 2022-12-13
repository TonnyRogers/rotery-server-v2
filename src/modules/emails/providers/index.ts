import { Provider } from '@nestjs/common';

import { EmailsService } from '../emails.service';

import { EmailsProviders } from '../enums/providers.enum';

export const emailsProviders: Provider[] = [
  {
    provide: EmailsProviders.EMAILS_SERVICE,
    useClass: EmailsService,
  },
];
