import { Migration } from '@mikro-orm/migrations';

export class Migration20221120235641 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "content_list" ("id" serial primary key, "file_id" int null, "external_url" varchar(255) null, "title" varchar(255) null, "content" varchar(255) null, "redirect_link" varchar(255) null, "action" varchar(255) null, "type" text check ("type" in (\'login_list\', \'welcome_season\', \'site_news\', \'app_ads\', \'app_tour\', \'backpacker_subs\', \'guide_subs\', \'generic\')) not null default \'generic\', "key" varchar(255) null, "icon" varchar(255) null, "is_list" boolean not null default false, "with_info" boolean not null default false, "is_animation" boolean not null default false, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "content_list" add constraint "content_list_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "content_list" cascade;');
  }
}
