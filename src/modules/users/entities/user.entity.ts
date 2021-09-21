import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum UserRole {
  MASTER = 'master',
  AGENCY = 'agency',
  AGENCY_USER = 'agency_user',
  USER = 'user',
}

@Entity()
export class User {
  constructor({
    username,
    email,
    password,
  }: Pick<User, 'username' | 'email' | 'password'>) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  deviceToken?: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Property({ type: 'boolean', default: false })
  isActive: boolean;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
