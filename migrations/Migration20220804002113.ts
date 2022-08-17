import { Migration } from '@mikro-orm/migrations';

export class Migration20220804002113 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_transport" ("location_id" int not null, "transport_id" int not null, "price" varchar(255) null, "description" varchar(255) null, "is_free" boolean not null default false, constraint "location_transport_pkey" primary key ("location_id", "transport_id"));',
    );

    this.addSql(
      'alter table "location_transport" add constraint "location_transport_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_transport" add constraint "location_transport_transport_id_foreign" foreign key ("transport_id") references "transport" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_transport" cascade;');
  }
}
