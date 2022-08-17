import { Migration } from '@mikro-orm/migrations';

export class Migration20220804001446 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_activity" ("location_id" int not null, "activity_id" int not null, "price" varchar(255) null, "description" varchar(255) null, "is_free" boolean not null default false, constraint "location_activity_pkey" primary key ("location_id", "activity_id"));',
    );

    this.addSql(
      'alter table "location_activity" add constraint "location_activity_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_activity" add constraint "location_activity_activity_id_foreign" foreign key ("activity_id") references "activity" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "itinerary_transport" alter column "price" type varchar(255) using ("price"::varchar(255));',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" type varchar(255) using ("description"::varchar(255));',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" drop not null;',
    );
    this.addSql('alter table "itinerary_transport" drop column "capacity";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_activity" cascade;');

    this.addSql(
      'alter table "itinerary_transport" add column "capacity" int not null;',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "price" type decimal(8,2) using ("price"::decimal(8,2));',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" type varchar(255) using ("description"::varchar(255));',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" set not null;',
    );
  }
}
