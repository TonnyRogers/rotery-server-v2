import { Migration } from '@mikro-orm/migrations';

export class Migration20210930003507 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "is_host" bool not null default false;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "is_host";');
  }
}
