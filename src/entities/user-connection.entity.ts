import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { User } from './user.entity';

@Entity()
export class UserConnection {
  constructor({ owner, target }: Pick<UserConnection, 'owner' | 'target'>) {
    this.owner = owner;
    this.target = target;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, {
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  owner!: User;

  @ManyToOne(() => User, {
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  target!: User;

  @Property({ type: 'boolean', default: false })
  isBlocked: boolean;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
