import {
  Entity,
  Enum,
  JsonType,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { BooleanKey } from 'aws-sdk/clients/iot';

import { userProfileFileSerializer } from '@/utils/serializers';

import { User } from './user.entity';

export enum ChatType {
  MESSAGE = 'message',
  BEGIN = 'begin',
  END = 'end',
  RATE = 'rate',
  LOCATION = 'location',
}

@Entity()
export class Chat {
  constructor({
    message,
    receiver,
    sender,
    type,
    jsonData,
  }: Pick<Chat, 'sender' | 'receiver' | 'type' | 'message' | 'jsonData'>) {
    this.sender = sender;
    this.receiver = receiver;
    this.type = type;
    this.message = message;
    this.jsonData = jsonData || null;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, {
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  sender!: User;

  @ManyToOne(() => User, {
    serializer: (value: User) => userProfileFileSerializer(value),
  })
  receiver!: User;

  @Property({ type: 'string' })
  message!: string;

  @Property({ type: 'boolean', default: false })
  readed!: BooleanKey;

  @Property({ type: JsonType, nullable: true })
  jsonData?: Record<string, unknown>;

  @Enum({ items: () => ChatType, default: ChatType.MESSAGE })
  type!: ChatType;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
