import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Activity {
  constructor({ alias, name }: Pick<Activity, 'name' | 'alias'>) {
    this.alias = alias;
    this.name = name;
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: false, type: 'string' })
  name!: string;

  @Property({ nullable: false, type: 'string' })
  alias!: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
