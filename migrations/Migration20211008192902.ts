import { Migration } from '@mikro-orm/migrations';

export class Migration20211008192902 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary_rating" ("id" bigserial primary key, "rate" int4 not null, "description" varchar(255) null, "itinerary_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "itinerary_rating" add constraint "itinerary_rating_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table "user_rating";');
  }
}
