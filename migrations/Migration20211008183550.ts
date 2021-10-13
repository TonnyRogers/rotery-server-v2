import { Migration } from '@mikro-orm/migrations';

export class Migration20211008183550 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_rating" ("id" bigserial primary key, "rate" int4 not null, "description" varchar(255) null, "user_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "user_rating" add constraint "user_rating_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table "user_rating";');
  }
}
