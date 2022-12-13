import { Provider } from '@nestjs/common';

import { ResetPasswordsService } from '../reset-passwords.service';
import { EmailsService } from '@/modules/emails/emails.service';

import { EmailsProviders } from '@/modules/emails/enums/providers.enum';
import { UsersProvider } from '@/modules/users/enums/users-provider.enum';
import { UsersRepository } from '@/modules/users/users.repository';

import { ResetPasswordProviders } from '../enums/providers.enum';
import { ResetPasswordRepository } from '../reset-password.repository';

export const resetPasswordProviders: Provider[] = [
  {
    provide: ResetPasswordProviders.RESET_PASSWORD_SERVICE,
    useClass: ResetPasswordsService,
  },
  {
    provide: ResetPasswordProviders.RESET_PASSWORD_REPOSITORY,
    useClass: ResetPasswordRepository,
  },
  {
    provide: EmailsProviders.EMAILS_SERVICE,
    useClass: EmailsService,
  },
];
