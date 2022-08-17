import { Migration } from '@mikro-orm/migrations';

export class Migration20220804000941 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_detailing" ("location_id" int not null, "type" text check ("type" in (\'duration\', \'mobility_access\', \'children_access\', \'animal_presente\', \'mobile_signal\', \'food_nearby\', \'guide_requested\', \'weekly_presence\')) not null, "quantity" int null, "measure" varchar(255) null, "level" text check ("level" in (\'low\', \'medium\', \'high\')) null, "validation" boolean null, "text" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "location_detailing_pkey" primary key ("location_id", "type"));',
    );

    this.addSql(
      'alter table "location_detailing" add constraint "location_detailing_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_detailing" cascade;');
  }
}
