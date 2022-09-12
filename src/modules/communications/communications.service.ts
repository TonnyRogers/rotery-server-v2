import { Inject, Injectable } from '@nestjs/common';

import { EmailsService } from '../emails/emails.service';
import { UsersService } from '../users/users.service';

import { UserRequestHelpMailTemplateParams } from '@/resources/emails/types/user-request-help';
import { EmailHelpRequestType } from '@/utils/constants';

import { CreateHelpRequestDto } from './dto/create-help-request.dto';

@Injectable()
export class CommunicationsService {
  constructor(
    @Inject(EmailsService)
    private emailsService: EmailsService,
    @Inject(UsersService)
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
        to: 'contato@rotery.com.br',
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
