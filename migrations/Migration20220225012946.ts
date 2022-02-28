import { Migration } from '@mikro-orm/migrations';

export class Migration20220225012946 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "itinerary_transport" ("itinerary_id" int4 not null, "transport_id" int4 not null, "capacity" int4 not null, "price" decimal(8,2) null, "description" varchar(255) not null, "is_free" bool not null default false);');
    this.addSql('alter table "itinerary_transport" add constraint "itinerary_transport_pkey" primary key ("itinerary_id", "transport_id");');

    this.addSql('alter table "itinerary_transport" add constraint "itinerary_transport_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "itinerary_transport" add constraint "itinerary_transport_transport_id_foreign" foreign key ("transport_id") references "transport" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table "itinerary_transport";');
  }

}
