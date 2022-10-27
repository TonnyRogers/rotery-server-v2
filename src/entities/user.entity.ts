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

import { WelcomeUserMailTemplateParams } from '@/resources/emails/types/welcome-user';

import {
  RabbitMailPublisherParams,
  RabbitMailPublisher,
} from '../providers/rabbit-publisher';
import { BankAccount } from './bank-account.entity';
import { DirectMessage } from './direct-message.entity';
import { ItineraryMember } from './itinerary-member.entity';
import { Itinerary } from './itinerary.entity';
import { Notification } from './notification.entity';
import { Profile } from './profile.entity';
import { Subscription } from './subscription.entity';
import { UserConnection } from './user-connection.entity';
import { UserRating } from './user-rating';

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
    isGuide,
  }: Pick<User, 'username' | 'email' | 'password' | 'isGuide'>) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isGuide = isGuide;
  }

  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true, lazy: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ nullable: true, lazy: true })
  deviceToken?: string;

  @Enum({ items: () => UserRole, default: UserRole.USER })
  role: UserRole;

  @Property({ type: 'boolean', default: false })
  isActive: boolean;

  @Property({ type: 'boolean', default: false })
  isGuide: boolean;

  @Property({ type: 'boolean', default: false })
  canRelateLocation: boolean;

  @Property({ type: 'string', nullable: true, lazy: true })
  activationCode: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscription = new Collection<Subscription>(this);

  @OneToOne(() => BankAccount, (bankAccount) => bankAccount.user, {
    lazy: true,
  })
  bankAccount!: BankAccount;

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

  @OneToMany(() => ItineraryMember, (itineraryMember) => itineraryMember.user)
  nextItineraries = new Collection<ItineraryMember>(this);

  @ManyToMany({ entity: () => Itinerary, owner: true })
  favoriteItineraries = new Collection<Itinerary>(this);

  @Property({ type: 'string', nullable: true, lazy: true })
  customerId!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();

  @Property({ persist: false })
  get ratingAvg() {
    if (this.ratings?.isInitialized()) {
      let totalRatings = 0;
      let ratingCount = 0;

      this.ratings.getItems().forEach((rating) => {
        totalRatings += rating.rate;
        ratingCount++;
      });

      return totalRatings / ratingCount;
    }
  }

  @AfterCreate()
  async afterCreate() {
    const { email, username } = this;

    const payload: RabbitMailPublisherParams<WelcomeUserMailTemplateParams> = {
      data: {
        to: email,
        type: 'welcome-user',
        payload: {
          name: username,
          activationCode: this.activationCode,
        },
      },
    };

    const rmqPublish = new RabbitMailPublisher();

    await rmqPublish.toQueue(payload);
  }
}
