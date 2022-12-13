import { Module } from '@nestjs/common';

import { EmailsService } from './emails.service';

import { EmailsController } from './emails.controller';
import { emailsProviders } from './providers';

@Module({
  controllers: [EmailsController],
  providers: emailsProviders,
  exports: emailsProviders,
})
export class EmailsModule {}
