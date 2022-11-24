import { Migration } from '@mikro-orm/migrations';

export class Migration20221109012429 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "refresh_token" ("user_id" int not null, "type" text check ("type" in (\'web\', \'mobile\')) not null, "token" text not null, "updated_at" timestamptz(0) not null, "expires_at" timestamptz(0) not null, constraint "refresh_token_pkey" primary key ("user_id", "type"));',
    );

    this.addSql(
      'alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete no action;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "refresh_token" cascade;');
  }
}
