import { Migration } from '@mikro-orm/migrations';

export class Migration20220724230255 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_activity" ("location_id" int not null, "activity_id" int not null, "capacity" int null, "price" decimal(8,2) null, "description" varchar(255) null, "is_free" boolean not null default false);',
    );
    this.addSql(
      'alter table "location_activity" add constraint "location_activity_pkey" primary key ("location_id", "activity_id");',
    );

    this.addSql(
      'alter table "location_activity" add constraint "location_activity_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_activity" add constraint "location_activity_activity_id_foreign" foreign key ("activity_id") references "activity" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_activity" cascade;');
  }
}
