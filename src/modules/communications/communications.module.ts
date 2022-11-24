import { Module } from '@nestjs/common';

import { CommunicationsService } from './communications.service';

import { EmailsModule } from '../emails/emails.module';
import { UsersModule } from '../users/users.module';
import { CommunicationsController } from './communications.controller';

@Module({
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  imports: [EmailsModule, UsersModule],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
