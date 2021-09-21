import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class File {
  @PrimaryKey()
  id!: number;

  @Property()
  url!: string;

  @Property()
  name!: string;

  @Property()
  type!: string;

  @Property()
  subtype!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
