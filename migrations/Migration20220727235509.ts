import { Migration } from '@mikro-orm/migrations';

export class Migration20220727235509 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_rating" ("owner_id" int not null, "location_id" int not null, "rate" int not null, "description" text null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "location_rating" add constraint "location_rating_pkey" primary key ("owner_id", "location_id");',
    );

    this.addSql(
      'alter table "location_rating" add constraint "location_rating_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_rating" add constraint "location_rating_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_rating" cascade;');
  }
}
