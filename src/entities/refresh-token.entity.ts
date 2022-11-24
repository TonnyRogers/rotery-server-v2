import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKeyType,
  Property,
  TextType,
} from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { User } from './user.entity';

export enum RefreshType {
  WEB = 'web',
  MOBILE = 'mobile',
}

@Entity()
export class RefreshToken {
  constructor({
    user,
    token,
    type,
    expiresAt,
  }: Omit<RefreshToken, 'updatedAt'>) {
    this.token = token;
    this.user = user;
    this.type = type;
    this.expiresAt = expiresAt;
  }

  @ManyToOne({
    entity: () => User,
    onDelete: 'no action',
    primary: true,
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  user!: User;

  @Enum({
    items: () => RefreshType,
    primary: true,
    lazy: true,
  })
  type!: RefreshType;

  @Property({
    lazy: true,
    type: TextType,
  })
  token!: string;

  @Property({
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();

  @Property()
  expiresAt: Date = new Date();

  [PrimaryKeyType]?: [number, string];
}
