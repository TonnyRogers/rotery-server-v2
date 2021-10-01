import {
  Entity,
  Enum,
  JsonType,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';

@Entity()
export class Profile {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  birth?: Date;

  @Property({ unique: true, nullable: true, lazy: true })
  document?: string;

  @Property({ nullable: true })
  profission?: string;

  @Property({ nullable: true, lazy: true })
  phone?: string;

  @Enum({ items: () => Gender, nullable: true })
  gender?: Gender;

  @Property({ nullable: true })
  location?: string;

  @Property({ type: JsonType, nullable: true, lazy: true })
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
