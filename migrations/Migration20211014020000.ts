import { Migration } from '@mikro-orm/migrations';

export class Migration20211014020000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "activation_code" varchar(255) null;',
    );
  }
  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "activation_code";');
  }
}
