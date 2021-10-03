import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class File {
  constructor({
    name,
    subtype,
    type,
    url,
  }: Pick<File, 'name' | 'subtype' | 'type' | 'url'>) {
    this.name = name;
    this.url = url;
    this.subtype = subtype;
    this.type = type;
  }

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
