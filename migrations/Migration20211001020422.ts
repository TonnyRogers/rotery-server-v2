import { Migration } from '@mikro-orm/migrations';

export class Migration20211001020422 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user_connection" ("id" serial primary key, "owner_id" int4 not null, "target_id" int4 not null, "is_blocked" bool not null default false, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "user_connection" add constraint "user_connection_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "user_connection" add constraint "user_connection_target_id_foreign" foreign key ("target_id") references "user" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "user_connection";');
  }
}
