import { Migration } from '@mikro-orm/migrations';

export class Migration20220724143531 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "location_alias_array" text[] null default \'{}\';',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "location_alias_array";');
  }
}
