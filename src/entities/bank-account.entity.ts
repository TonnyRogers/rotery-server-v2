import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from './user.entity';

export enum BankAccountTypeEnum {
  CC = 'conta_corrente',
  CP = 'conta_poupanca',
  MEI = 'conta_mei',
}

@Entity()
export class BankAccount {
  constructor({
    account,
    agency,
    accountType,
    bankCode,
    bankName,
    payDay,
    user,
  }: Omit<BankAccount, 'createdAt' | 'updatedAt' | 'id'>) {
    this.account = account;
    this.agency = agency;
    this.accountType = accountType;
    this.bankCode = bankCode;
    this.bankName = bankName;
    this.payDay = payDay;
    this.user = user;
  }

  @PrimaryKey()
  id!: number;

  @Property({ type: 'string' })
  bankCode!: string;

  @Property({ type: 'string' })
  bankName!: string;

  @Property({ type: 'string' })
  account!: string;

  @Enum({ items: () => BankAccountTypeEnum, default: BankAccountTypeEnum.CC })
  accountType!: string;

  @Property({ type: 'string' })
  agency!: string;

  @OneToOne(() => User, (user) => user.bankAccount, {
    owner: true,
  })
  user!: User;

  @Property()
  payDay!: number;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
