import { Migration } from '@mikro-orm/migrations';

export class Migration20220817230411 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "guide_user_location" ("user_id" int not null, "location_id" int not null, constraint "guide_user_location_pkey" primary key ("user_id", "location_id"));',
    );

    this.addSql(
      'alter table "guide_user_location" add constraint "guide_user_location_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "guide_user_location" add constraint "guide_user_location_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "guide_user_location" cascade;');
  }
}
