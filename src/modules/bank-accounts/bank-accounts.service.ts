import { Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { UsersService } from '../users/users.service';

import { BankAccount } from '@/entities/bank-account.entity';

import { UsersProvider } from '../users/enums/users-provider.enum';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(
    @Inject(UsersProvider.USERS_SERVICE)
    private usersService: UsersService,
    @InjectRepository(BankAccount)
    private bankAccountRepository: EntityRepository<BankAccount>,
  ) {}

  async create(authUserId: number, createBankAccountDto: CreateBankAccountDto) {
    try {
      const user = await this.usersService.findOne({ id: authUserId });

      const newBankAccount = new BankAccount({
        user,
        ...createBankAccountDto,
      });

      await this.bankAccountRepository.persistAndFlush(newBankAccount);

      return newBankAccount;
    } catch (error) {
      throw error;
    }
  }

  async findOne(authUserId: number) {
    try {
      const bankUser = await this.bankAccountRepository.findOne({
        user: authUserId,
      });

      return bankUser;
    } catch (error) {
      throw error;
    }
  }

  async update(authUserId: number, updateBankAccount: UpdateBankAccountDto) {
    try {
      await this.bankAccountRepository.nativeUpdate(
        {
          user: authUserId,
        },
        updateBankAccount,
      );

      return await this.bankAccountRepository.findOne({ user: authUserId });
    } catch (error) {
      throw error;
    }
  }
}
