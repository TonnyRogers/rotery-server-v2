import { Migration } from '@mikro-orm/migrations';

export class Migration20211005234258 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "itinerary_question" ("id" bigserial primary key, "question" varchar(255) not null, "answer" varchar(255) null, "is_visible" bool not null default true, "itinerary_id" int4 not null, "owner_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "itinerary_question" add constraint "itinerary_question_itinerary_id_foreign" foreign key ("itinerary_id") references "itinerary" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "itinerary_question" add constraint "itinerary_question_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table "itinerary_photo";');
  }
}
