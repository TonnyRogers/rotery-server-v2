import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ResetPassword } from '../../entities/reset-password.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import moment from 'moment-timezone';
import { NewPasswordDto } from './dto/new-password.dto';
import { RabbitMQPublisher } from 'src/providers/rabbit-publisher';
import { EmailTypes } from 'utils/constants';

@Injectable()
export class ResetPasswordsService {
  constructor(
    @InjectRepository(ResetPassword)
    private resetPasswordsRepository: EntityRepository<ResetPassword>,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async create(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.usersService.findOne({
        email: resetPasswordDto.email,
      });

      const reset = await this.resetPasswordsRepository.findOneOrFail({
        user: 'id' in user && user.id,
      });

      if (reset) {
        await this.resetPasswordsRepository.removeAndFlush(reset);
      }

      const newReset = new ResetPassword({
        user: 'id' in user && user,
        code: String(Math.floor(100000 + Math.random() * 900000)),
        dateLimit: moment().add(1, 'hour').toDate(),
      });

      await this.resetPasswordsRepository.persistAndFlush(newReset);
    } catch (error) {
      throw error;
    }
  }

  async findOne(code: number, returnEntity = false) {
    try {
      const dateNow = moment().valueOf();

      const findReset = await this.resetPasswordsRepository.findOneOrFail({
        code: String(code),
      });

      if (!findReset) {
        throw new HttpException('Invalid reset code.', 400);
      }

      const resetDate = moment(findReset.dateLimit).valueOf();

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

      await this.resetPasswordsRepository.nativeDelete({
        id: 'id' in findReset && findReset.id,
      });

      const rabbitPublish = new RabbitMQPublisher();

      const payload = {
        data: {
          type: EmailTypes.password,
          payload: {
            name: 'id' in findReset && findReset.user.username,
            email: 'id' in findReset && findReset.user.email,
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
