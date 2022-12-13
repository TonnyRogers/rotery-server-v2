import { HttpException, Inject, Injectable } from '@nestjs/common';

import { EmailsServiceInterface } from '../emails/interfaces/emails-service.interface';
import { UsersService } from '../users/users.service';
import { ResetPasswordServiceInterface } from './interfaces/reset-password-service.interface';

import { dayjsPlugins } from '@/providers/dayjs-config';
import { UserNewPassWordMailTemplateParams } from '@/resources/emails/types/user-new-password';
import { UserRecoverPassWordMailTemplateParams } from '@/resources/emails/types/user-recover-password';

import { ResetPassword } from '../../entities/reset-password.entity';
import {
  RabbitMailPublisherParams,
  RabbitMailPublisher,
} from '../../providers/rabbit-publisher';
import { EmailsProviders } from '../emails/enums/providers.enum';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { NewPasswordDto } from './dto/new-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordProviders } from './enums/providers.enum';
import { ResetPasswordRepositoryInterface } from './interfaces/reset-password-repository.interface';

@Injectable()
export class ResetPasswordsService implements ResetPasswordServiceInterface {
  constructor(
    @Inject(ResetPasswordProviders.RESET_PASSWORD_REPOSITORY)
    private resetPasswordsRepository: ResetPasswordRepositoryInterface,
    @Inject(UsersProvider.USERS_SERVICE)
    private usersService: UsersService,
    @Inject(EmailsProviders.EMAILS_SERVICE)
    private emailsService: EmailsServiceInterface,
  ) {}

  async create(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.usersService.findOneWithEmail({
        email: resetPasswordDto.email,
      });

      if (user) {
        const reset = await this.resetPasswordsRepository.findOne({
          user: user.id,
        });

        if (reset) {
          await this.resetPasswordsRepository.delete({ id: reset.id });
        }

        const code = String(Math.floor(100000 + Math.random() * 900000));

        const newReset = new ResetPassword({
          user: user,
          code,
          dateLimit: dayjsPlugins().add(1, 'hour').toDate(),
        });

        await this.resetPasswordsRepository.create(newReset);

        await this.emailsService.queue<UserRecoverPassWordMailTemplateParams>({
          to: user.email,
          type: 'user-recover-password',
          payload: {
            name: user.username,
            resetcode: Number(code),
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: number, returnEntity = false) {
    try {
      const dateNow = dayjsPlugins().valueOf();

      const findReset = await this.resetPasswordsRepository.findOne({
        code: String(code),
      });

      if (!findReset) {
        throw new HttpException('Invalid reset code.', 400);
      }

      const resetDate = dayjsPlugins(findReset.dateLimit).valueOf();

      if (dateNow > resetDate) {
        throw new HttpException('Reset code expired request other.', 400);
      }

      if (returnEntity) {
        return findReset;
      }
      return { message: 'Valid code.', statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async reset(code: number, newPasswordDto: NewPasswordDto) {
    try {
      const findReset = await this.findOne(code, true);

      if (newPasswordDto.passwordConfirmation !== newPasswordDto.password) {
        throw new HttpException('This password dont match.', 401);
      }

      await this.usersService.setNewPassword(
        'id' in findReset && findReset.user.id,
        newPasswordDto.password,
      );

      await this.resetPasswordsRepository.delete({
        id: 'id' in findReset && findReset.id,
      });

      const rabbitPublish = new RabbitMailPublisher();

      const payload: RabbitMailPublisherParams<UserNewPassWordMailTemplateParams> =
        {
          data: {
            to: 'id' in findReset && findReset.user.email,
            type: 'user-new-password',
            payload: {
              name: 'id' in findReset && findReset.user.username,
            },
          },
        };

      await rabbitPublish.toQueue(payload);

      return { message: "That Work's", statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }
}
