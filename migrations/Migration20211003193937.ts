import { Migration } from '@mikro-orm/migrations';

export class Migration20211003193937 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "activity" ("id" serial primary key, "name" varchar(255) not null, "alias" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "activity";');
  }
}
