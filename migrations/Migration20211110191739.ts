import { Migration } from '@mikro-orm/migrations';

export class Migration20211110191739 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "itinerary" add column "request_payment" bool not null default false;',
    );
  }
  async down(): Promise<void> {
    this.addSql('alter table "itinerary" drop column "request_payment";');
  }
}
