import { Migration } from '@mikro-orm/migrations';

export class Migration20220225013124 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_favorite_itineraries" ("user_id" int4 not null, "itinerary_id" int4 not null);');
    this.addSql('alter table "user_favorite_itineraries" add constraint "user_favorite_itineraries_pkey" primary key ("user_id", "itinerary_id");');

    this.addSql('alter table "user_favorite_itineraries" add constraint "user_favorite_itineraries_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_favorite_itineraries" add constraint "user_favorite_itineraries_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table "user_favorite_itineraries";');
  }

}
