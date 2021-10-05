import { Migration } from '@mikro-orm/migrations';

export class Migration20211005012207 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary_lodging" ("id" serial primary key, "itinerary_id" int4 not null, "lodging_id" int4 not null, "capacity" int4 not null, "price" decimal(8,2) null, "description" varchar(255) not null, "is_free" bool not null default false, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "itinerary_lodging" add constraint "itinerary_lodging_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "itinerary_lodging" add constraint "itinerary_lodging_lodging_id_foreign" foreign key ("lodging_id") references "lodging" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "itinerary_lodging";');
  }
}
