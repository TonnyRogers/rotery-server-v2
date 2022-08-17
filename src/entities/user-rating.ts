import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { User } from './user.entity';

@Entity()
export class UserRating {
  constructor({
    description,
    rate,
    user,
    owner,
  }: Omit<UserRating, 'id' | 'createdAt' | 'updatedAt'>) {
    this.description = description;
    this.rate = rate;
    this.user = user;
    this.owner = owner;
  }

  @Property({ nullable: false })
  rate!: number;

  @Property({ nullable: true })
  description: string;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    primary: true,
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  user!: User;

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => userProfileFileSerializer(value),
  })
  owner!: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  [PrimaryKeyType]?: [number, number];
}
