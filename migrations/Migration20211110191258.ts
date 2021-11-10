import { Migration } from '@mikro-orm/migrations';

export class Migration20211110191258 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table \"itinerary_member\" add column \"payment_id\" varchar(255) null, add column \"payment_status\" text check (\"payment_status\" in ('paid', 'pending', 'refunded', 'refused', 'free')) not null default 'free';",
    );
  }
  async down(): Promise<void> {
    this.addSql(
      'alter table "itinerary_member" drop column "payment_id" , drop column "payment_status";',
    );
  }
}
