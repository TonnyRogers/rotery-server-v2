import { Migration } from '@mikro-orm/migrations';

export class Migration20211005011619 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary" ("id" serial primary key, "name" varchar(255) not null, "begin" timestamptz(0) not null, "end" timestamptz(0) not null, "deadline_for_join" timestamptz(0) not null, "description" text not null, "capacity" int4 not null, "location" varchar(255) not null, "location_json" jsonb null, "status" text check ("status" in (\'active\', \'on_going\', \'finished\', \'cancelled\')) not null default \'active\', "is_private" bool not null default false, "owner_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "itinerary" add constraint "itinerary_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "itinerary";');
  }
}
