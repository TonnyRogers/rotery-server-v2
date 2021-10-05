import { Migration } from '@mikro-orm/migrations';

export class Migration20211005012410 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary_photo" ("id" serial primary key, "itinerary_id" int4 not null, "file_id" int4 not null);',
    );

    this.addSql(
      'alter table "itinerary_photo" add constraint "itinerary_photo_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "itinerary_photo" add constraint "itinerary_photo_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "itinerary_photo";');
  }
}
