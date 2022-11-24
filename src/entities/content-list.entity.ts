import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { File } from './file.entity';

export enum ContentType {
  LOGIN_LIST = 'login_list',
  WELCOME_SEASON_BANNER = 'welcome_season',
  SITE_NEWS = 'site_news',
  APP_ADS = 'app_ads',
  APP_GUIDED_TOUR = 'app_tour',
  BACKPACKER_SUBSCRIPTION = 'backpacker_subs',
  GUIDE_SUBSCRIPTION = 'guide_subs',
  GENERIC = 'generic',
}

@Entity()
export class ContentList {
  constructor({
    action = null,
    content = null,
    externalUrl = null,
    file = null,
    icon = null,
    key = null,
    redirectLink = null,
    title = null,
    type = null,
    isAnimation,
    isList,
    withInfo,
  }: Omit<ContentList, 'id' | 'createdAt' | 'updatedAt'>) {
    this.action = action;
    this.content = content;
    this.externalUrl = externalUrl;
    this.file = file;
    this.icon = icon;
    this.key = key;
    this.redirectLink = redirectLink;
    this.title = title;
    this.type = type;
    this.isAnimation = isAnimation;
    this.isList = isList;
    this.withInfo = withInfo;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => File, { nullable: true })
  file?: File;

  @Property({ type: 'string', nullable: true })
  externalUrl?: string;

  @Property({ type: 'string', nullable: true })
  title?: string;

  @Property({ type: 'string', nullable: true })
  content?: string;

  @Property({ type: 'string', nullable: true })
  redirectLink?: string;

  @Property({ type: 'string', nullable: true })
  action?: string;

  @Enum({ items: () => ContentType, default: ContentType.GENERIC })
  type?: ContentType;

  @Property({ type: 'string', nullable: true })
  key?: string;

  @Property({ type: 'string', nullable: true })
  icon?: string;

  @Property({ type: 'boolean', default: false })
  isList: boolean;

  @Property({ type: 'boolean', default: false })
  withInfo: boolean;

  @Property({ type: 'boolean', default: false })
  isAnimation: boolean;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
