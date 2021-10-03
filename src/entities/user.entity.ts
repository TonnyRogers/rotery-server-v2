import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserConnection } from './user-connection.entity';
import { DirectMessage } from './direct-message.entity';
import { Profile } from './profile.entity';

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

  @Property({ unique: true, lazy: true })
  email!: string;

  @Property({ lazy: true })
  password!: string;

  @Property({ nullable: true, lazy: true })
  deviceToken?: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Property({ type: 'boolean', default: false })
  isActive: boolean;

  @Property({ type: 'boolean', default: false })
  isHost: boolean;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToMany(() => DirectMessage, (directMessage) => directMessage.receiver)
  directs = new Collection<DirectMessage>(this);

  @OneToMany(() => UserConnection, (userConnection) => userConnection.owner)
  connections = new Collection<User>(this);

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
