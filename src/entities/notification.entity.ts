import {
  BigIntType,
  Entity,
  Enum,
  JsonType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';

export enum NotificationAlias {
  ITINERARY_RATE = 'itinerary_rate',
  NEW_MESSAGE = 'new_message',
  ITINERARY_UPDATED = 'itinerary_updated',
  ITINERARY_DELETED = 'itinerary_deleted',
  ITINERARY_MEMBER_REQUEST = 'itinerary_member_request',
  ITINERARY_MEMBER_ACCEPTED = 'itinerary_member_accepted',
  ITINERARY_MEMBER_REJECTED = 'itinerary_member_rejected',
  ITINERARY_MEMBER_PROMOTED = 'itinerary_member_promoted',
  ITINERARY_MEMBER_DEMOTED = 'itinerary_member_demoted',
  ITINERARY_QUESTION = 'itinerary_question',
  ITINERARY_ANSWER = 'itinerary_answer',
  NEW_CONNECTION_ACCEPTED = 'new_connection_accpted',
  NEW_CONNECTION = 'new_connection',
  CONNECTION_BLOCK = 'connection_block',
  CONNECTION_UNBLOCK = 'connection_unblock',
}

@Entity()
export class Notification {
  constructor({
    alias,
    content,
    subject,
    user,
    jsonData,
  }: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'isReaded'>) {
    this.alias = alias;
    this.content = content;
    this.subject = subject;
    this.user = user;
    this.jsonData = jsonData || null;
  }

  @PrimaryKey({ type: BigIntType })
  id!: string;

  @ManyToOne({ entity: () => User, onDelete: 'cascade' })
  user!: User;

  @Property({ type: 'boolean', default: false })
  isReaded!: boolean;

  @Property({ nullable: false })
  subject!: string;

  @Property({ nullable: false })
  content!: string;

  @Property({ type: JsonType, nullable: true })
  jsonData: Record<string, unknown>;

  @Enum({ items: () => NotificationAlias, nullable: false })
  alias!: NotificationAlias;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
