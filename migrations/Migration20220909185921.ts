import { Migration } from '@mikro-orm/migrations';

export class Migration20220909185921 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "activity" add column "icon" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "activity" drop column "icon";');
  }
}
