import { Migration } from '@mikro-orm/migrations';

export class Migration20220723131111 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "location" varchar(255) not null, "location_json" jsonb null, "alias" varchar(255) not null, "type" text check ("type" in (\'beach\', \'waterfall\', \'cavern\', \'mountain\', \'park\', \'place\')) not null default \'place\', "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location" cascade;');
  }
}
