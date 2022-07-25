import { Migration } from '@mikro-orm/migrations';

export class Migration20220724230433 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_lodging" ("location_id" int not null, "lodging_id" int not null, "capacity" int null, "price" decimal(8,2) null, "description" varchar(255) null, "is_free" boolean not null default false);',
    );
    this.addSql(
      'alter table "location_lodging" add constraint "location_lodging_pkey" primary key ("location_id", "lodging_id");',
    );

    this.addSql(
      'alter table "location_lodging" add constraint "location_lodging_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_lodging" add constraint "location_lodging_lodging_id_foreign" foreign key ("lodging_id") references "lodging" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_lodging" cascade;');
  }
}
