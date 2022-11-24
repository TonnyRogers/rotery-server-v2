import { Migration } from '@mikro-orm/migrations';

export class Migration20220804002240 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "chat" ("id" serial primary key, "sender_id" int not null, "receiver_id" int not null, "message" varchar(255) not null, "readed" boolean not null default false, "json_data" jsonb null, "type" text check ("type" in (\'message\', \'begin\', \'end\', \'rate\', \'location\')) not null default \'message\', "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );

    this.addSql(
      'alter table "chat" add constraint "chat_sender_id_foreign" foreign key ("sender_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "chat" add constraint "chat_receiver_id_foreign" foreign key ("receiver_id") references "user" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "chat" cascade;');
  }
}
