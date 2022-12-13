import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from './user.entity';

@Entity()
export class ResetPassword {
  constructor({
    code,
    dateLimit,
    user,
  }: Pick<ResetPassword, 'code' | 'dateLimit' | 'user'>) {
    this.code = code;
    this.dateLimit = dateLimit;
    this.user = user;
  }

  @PrimaryKey()
  id!: number;

  @Property({ type: 'string', nullable: false })
  code!: string;

  @OneToOne({ entity: () => User })
  user!: User;

  @Property({ nullable: false })
  dateLimit!: Date;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
