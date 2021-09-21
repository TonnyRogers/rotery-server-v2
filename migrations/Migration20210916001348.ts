import { Migration } from '@mikro-orm/migrations';

export class Migration20210916001348 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "device_token" varchar(255) null, "role" text check ("role" in (\'master\', \'agency\', \'agency_user\', \'user\')) not null default \'user\', "is_active" bool not null default false, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_username_unique" unique ("username");',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "user";');
  }
}
