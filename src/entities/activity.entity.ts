import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Activity {
  constructor({
    alias,
    name,
    icon,
  }: Pick<Activity, 'name' | 'alias' | 'icon'>) {
    this.alias = alias;
    this.name = name;
    this.icon = icon;
  }

  @PrimaryKey()
  id!: number;

  @Property({ nullable: false, type: 'string' })
  name!: string;

  @Property({ nullable: false, type: 'string' })
  alias!: string;

  @Property({ nullable: true, type: 'string' })
  icon?: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
