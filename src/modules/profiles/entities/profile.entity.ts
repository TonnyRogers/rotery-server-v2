import {
  Entity,
  Enum,
  JsonType,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { File } from '../../files/entities/file.entity';

@Entity()
export class Profile {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: true })
  birth?: Date;

  @Property({ unique: true, nullable: true })
  document?: string;

  @Property({ nullable: true })
  profission?: string;

  @Property({ nullable: true })
  phone?: string;

  @Enum({ items: () => Gender, nullable: true })
  gender?: Gender;

  @Property({ nullable: true })
  location?: string;

  @Property({ type: JsonType, nullable: true })
  locationJson?: Record<string, unknown>;

  @OneToOne({ nullable: true, onDelete: 'set null' })
  file?: File;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
