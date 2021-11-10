import { Migration } from '@mikro-orm/migrations';

export class Migration20211108212926 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "customer_id" varchar(255) null;',
    );
  }
  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "customer_id";');
  }
}
