import {
  AfterCreate,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserConnection } from './user-connection.entity';
import { DirectMessage } from './direct-message.entity';
import { Profile } from './profile.entity';
import { Itinerary } from './itinerary.entity';
import { Notification } from './notification.entity';
import { UserRating } from './user-rating';
import { RabbitMQPublisher } from '../providers/rabbit-publisher';
import { EmailTypes } from '../../utils/constants';

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

  @Property({ unique: true, hidden: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ nullable: true, hidden: true })
  deviceToken?: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Property({ type: 'boolean', default: false })
  isActive: boolean;

  @Property({ type: 'boolean', default: false })
  isHost: boolean;

  @Property({ type: 'string', nullable: true, hidden: true })
  activationCode: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToMany(() => DirectMessage, (directMessage) => directMessage.receiver)
  directs = new Collection<DirectMessage>(this);

  @OneToMany(() => UserConnection, (userConnection) => userConnection.owner)
  connections = new Collection<User>(this);

  @OneToMany(() => Itinerary, (itinerary) => itinerary.owner)
  itineraries = new Collection<Itinerary>(this);

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications = new Collection<Notification>(this);

  @OneToMany(() => UserRating, (userRating) => userRating.user)
  ratings = new Collection<UserRating>(this);

  @ManyToMany({ entity: () => Itinerary, owner: true })
  favoriteItineraries = new Collection<Itinerary>(this);

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  // @Property({ name: 'getEmail' })
  // getEmail() {
  //   return `${this.email}`;
  // }

  @AfterCreate()
  async afterCreate() {
    const { email, username } = this;

    const payload = {
      data: {
        type: EmailTypes.welcome,
        payload: {
          name: username,
          email,
          activationCode: this.activationCode,
        },
      },
    };

    const rmqPublish = new RabbitMQPublisher();

    await rmqPublish.toQueue(payload);
  }
}
