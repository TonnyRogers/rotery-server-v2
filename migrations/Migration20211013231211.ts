import { Migration } from '@mikro-orm/migrations';

export class Migration20211013231211 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "reset_password" ("id" serial primary key, "code" varchar(255) not null, "user_id" int4 not null, "date_limit" timestamptz(0) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "reset_password" add constraint "reset_password_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'alter table "reset_password" add constraint "reset_password_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table "reset_password";');
  }
}
