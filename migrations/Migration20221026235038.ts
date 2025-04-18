import { Migration } from '@mikro-orm/migrations';

export class Migration20221026235038 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "notification" drop constraint if exists "notification_alias_check";',
    );

    this.addSql(
      'alter table "notification" alter column "alias" type text using ("alias"::text);',
    );
    this.addSql(
      "alter table \"notification\" add constraint \"notification_alias_check\" check (\"alias\" in ('rate_itinerary', 'rate_location', 'new_message', 'new_chat', 'itinerary_updated', 'itinerary_deleted', 'itinerary_member_request', 'itinerary_member_accepted', 'itinerary_member_rejected', 'itinerary_member_promoted', 'itinerary_member_demoted', 'itinerary_question', 'itinerary_answer', 'new_connection_accepted', 'new_connection', 'connection_block', 'connection_unblock', 'guide_activated'));",
    );
  }

  async down(): Promise<void> {
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
}
