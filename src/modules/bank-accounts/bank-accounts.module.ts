import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { BankAccountsService } from './bank-accounts.service';

import { BankAccount } from '@/entities/bank-account.entity';

import { UsersModule } from '../users/users.module';
import { BankAccountsController } from './bank-accounts.controller';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  imports: [MikroOrmModule.forFeature([BankAccount]), UsersModule],
})
export class BankAccountsModule {}
