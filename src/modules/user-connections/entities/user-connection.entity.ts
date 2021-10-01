import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserConnection {
  constructor({ owner, target }: Pick<UserConnection, 'owner' | 'target'>) {
    this.owner = owner;
    this.target = target;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  owner!: User;

  @ManyToOne(() => User)
  target!: User;

  @Property({ type: 'boolean', default: false })
  isBlocked: boolean;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
