import { Migration } from '@mikro-orm/migrations';

export class Migration20210916001416 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "file" ("id" serial primary key, "url" varchar(255) not null, "name" varchar(255) not null, "type" varchar(255) not null, "subtype" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "file";');
  }
}
