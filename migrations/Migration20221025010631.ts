import { Migration } from '@mikro-orm/migrations';

export class Migration20221025010631 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "can_relate_location" boolean not null default false;',
    );
    this.addSql('alter table "user" rename column "is_host" to "is_guide";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" rename column "is_guide" to "is_host";');
    this.addSql('alter table "user" drop column "can_relate_location";');
  }
}
