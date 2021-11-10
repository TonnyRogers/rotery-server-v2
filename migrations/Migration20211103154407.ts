import { Migration } from '@mikro-orm/migrations';

export class Migration20211103154407 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "itinerary" add column "deleted_at" timestamptz(0) null;',
    );
  }
  async down(): Promise<void> {
    this.addSql('alter table "itinerary" drop column "deleted_at";');
  }
}
