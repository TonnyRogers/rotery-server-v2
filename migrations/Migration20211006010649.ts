import { Migration } from '@mikro-orm/migrations';

export class Migration20211006010649 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary_member" ("id" bigserial primary key, "is_admin" bool not null default false, "is_accepted" bool not null default false, "itinerary_id" int4 not null, "user_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null);',
    );

    this.addSql(
      'alter table "itinerary_member" add constraint "itinerary_member_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "itinerary_member" add constraint "itinerary_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table "itinerary_member";');
  }
}
