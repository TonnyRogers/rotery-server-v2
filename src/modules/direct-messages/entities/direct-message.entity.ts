import {
  Entity,
  Enum,
  JsonType,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BooleanKey } from 'aws-sdk/clients/iot';
import { File } from '../../files/entities/file.entity';
import { User } from '../../users/entities/user.entity';

export enum MessageType {
  MESSAGE = 'message',
  ITINERARY_INVITE = 'itinerary_invite',
}

@Entity()
export class DirectMessage {
  constructor({
    message,
    receiver,
    sender,
    type,
    jsonData,
  }: Pick<
    DirectMessage,
    'sender' | 'receiver' | 'type' | 'message' | 'jsonData'
  >) {
    this.sender = sender;
    this.receiver = receiver;
    this.type = type || MessageType.MESSAGE;
    this.message = message;
    this.jsonData = jsonData || null;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  sender!: User;

  @ManyToOne(() => User)
  receiver!: User;

  @OneToOne({ nullable: true })
  file?: File;

  @Property({ type: 'string' })
  message!: string;

  @Property({ type: 'boolean', default: false })
  readed!: BooleanKey;

  @Property({ type: JsonType, nullable: true })
  jsonData?: Record<string, unknown>;

  @Enum({ items: () => MessageType, default: MessageType.MESSAGE })
  type!: MessageType;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
