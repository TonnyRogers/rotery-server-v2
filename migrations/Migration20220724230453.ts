import { Migration } from '@mikro-orm/migrations';

export class Migration20220724230453 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_photo" ("location_id" int not null, "file_id" int not null);',
    );
    this.addSql(
      'alter table "location_photo" add constraint "location_photo_pkey" primary key ("location_id", "file_id");',
    );

    this.addSql(
      'alter table "location_photo" add constraint "location_photo_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_photo" add constraint "location_photo_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_photo" cascade;');
  }
}
