import { Migration } from '@mikro-orm/migrations';

export class Migration20211008183351 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table \"notification\" (\"id\" bigserial primary key, \"user_id\" int4 not null, \"is_readed\" bool not null default false, \"subject\" varchar(255) not null, \"content\" varchar(255) not null, \"json_data\" jsonb null, \"alias\" text check (\"alias\" in ('itinerary_rate', 'new_message', 'itinerary_updated', 'itinerary_deleted', 'itinerary_member_request', 'itinerary_member_accepted', 'itinerary_member_rejected', 'itinerary_member_promoted', 'itinerary_member_demoted', 'itinerary_question', 'itinerary_answer', 'new_connection_accpted', 'new_connection')) not null, \"created_at\" timestamptz(0) not null, \"updated_at\" timestamptz(0) not null);",
    );

    this.addSql(
      'alter table "notification" add constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table "notification";');
  }
}
