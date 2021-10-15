import {
  Entity,
  Enum,
  JsonType,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity()
export class Profile {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  birth?: Date;

  @Property({ unique: true, nullable: true, hidden: true })
  document?: string;

  @Property({ nullable: true })
  profission?: string;

  @Property({ nullable: true, hidden: true })
  phone?: string;

  @Enum({ items: () => Gender, nullable: true })
  gender?: Gender;

  @Property({ nullable: true })
  location?: string;

  @Property({ type: JsonType, nullable: true, hidden: true })
  locationJson?: Record<string, unknown>;

  @OneToOne({ nullable: true, onDelete: 'set null' })
  file?: File;

  @OneToOne(() => User, (user) => user.profile, {
    owner: true,
    nullable: false,
    onDelete: 'cascade',
  })
  user!: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  constructor(user: User) {
    this.user = user;
  }
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
