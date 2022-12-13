import { Inject, Injectable } from '@nestjs/common';

import { EmailsServiceInterface } from '../emails/interfaces/emails-service.interface';
import { UsersService } from '../users/users.service';

import { appConfig } from '@/config';
import { UserRequestHelpMailTemplateParams } from '@/resources/emails/types/user-request-help';
import { EmailHelpRequestType } from '@/utils/constants';

import { EmailsProviders } from '../emails/enums/providers.enum';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { CreateHelpRequestDto } from './dto/create-help-request.dto';

@Injectable()
export class CommunicationsService {
  constructor(
    @Inject(EmailsProviders.EMAILS_SERVICE)
    private emailsService: EmailsServiceInterface,
    @Inject(UsersProvider.USERS_SERVICE)
    private usersService: UsersService,
  ) {}

  async requestHelp(
    authUserId: number,
    createHelpRequestDto: CreateHelpRequestDto,
  ) {
    const user = await this.usersService.findOneWithEmail({ id: authUserId });

    try {
      return await this.emailsService.queue<UserRequestHelpMailTemplateParams>({
        type: 'user-request-help',
        to: appConfig.emailFrom,
        payload: {
          name: user.username,
          data: createHelpRequestDto.data,
          message: createHelpRequestDto.message,
          type: EmailHelpRequestType[createHelpRequestDto.type],
          userEmail: user.email,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
