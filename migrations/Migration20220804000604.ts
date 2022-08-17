import { Migration } from '@mikro-orm/migrations';

export class Migration20220804000604 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location_photo" ("location_id" int not null, "file_id" int not null, constraint "location_photo_pkey" primary key ("location_id", "file_id"));',
    );

    this.addSql(
      'alter table "location_photo" add constraint "location_photo_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "location_photo" add constraint "location_photo_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "notification" drop constraint if exists "notification_alias_check";',
    );

    this.addSql(
      'alter table "notification" alter column "alias" type text using ("alias"::text);',
    );
    this.addSql(
      "alter table \"notification\" add constraint \"notification_alias_check\" check (\"alias\" in ('rate_itinerary', 'rate_location', 'new_message', 'new_chat', 'itinerary_updated', 'itinerary_deleted', 'itinerary_member_request', 'itinerary_member_accepted', 'itinerary_member_rejected', 'itinerary_member_promoted', 'itinerary_member_demoted', 'itinerary_question', 'itinerary_answer', 'new_connection_accepted', 'new_connection', 'connection_block', 'connection_unblock'));",
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location_photo" cascade;');

    this.addSql(
      'alter table "notification" drop constraint if exists "notification_alias_check";',
    );

    this.addSql(
      'alter table "notification" alter column "alias" type text using ("alias"::text);',
    );
    this.addSql(
      "alter table \"notification\" add constraint \"notification_alias_check\" check (\"alias\" in ('rate_itinerary', 'new_message', 'itinerary_updated', 'itinerary_deleted', 'itinerary_member_request', 'itinerary_member_accepted', 'itinerary_member_rejected', 'itinerary_member_promoted', 'itinerary_member_demoted', 'itinerary_question', 'itinerary_answer', 'new_connection_accepted', 'new_connection', 'connection_block', 'connection_unblock'));",
    );
  }
}
