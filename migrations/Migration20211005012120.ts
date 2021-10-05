import { Migration } from '@mikro-orm/migrations';

export class Migration20211005012120 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary_activity" ("id" serial primary key, "itinerary_id" int4 not null, "activity_id" int4 not null, "capacity" int4 not null, "price" decimal(8,2) null, "description" varchar(255) not null, "is_free" bool not null default false, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "itinerary_activity" add constraint "itinerary_activity_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "itinerary_activity" add constraint "itinerary_activity_activity_id_foreign" foreign key ("activity_id") references "activity" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "itinerary_activity";');
  }
}
