import { userProfileFileSerializer } from '@/utils/serializers';
import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class UserRating {
  constructor({
    description,
    rate,
    user,
  }: Omit<UserRating, 'id' | 'createdAt' | 'updatedAt'>) {
    this.description = description;
    this.rate = rate;
    this.user = user;
  }

  @PrimaryKey({ type: BigIntType })
  id!: string;

  @Property({ nullable: false })
  rate!: number;

  @Property({ nullable: true })
  description: string;

  @ManyToOne({ 
    entity: () => User, 
    onDelete: 'cascade',  
    serializer: (value: User) => userProfileFileSerializer(value) 
  })
  user!: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
