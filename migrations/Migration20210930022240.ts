import { Migration } from '@mikro-orm/migrations';

export class Migration20210930022240 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "direct_message" ("id" serial primary key, "sender_id" int4 not null, "receiver_id" int4 not null, "file_id" int4 null, "message" varchar(255) not null, "readed" bool not null default false, "json_data" jsonb null, "type" text check ("type" in (\'message\', \'itinerary_invite\')) not null default \'message\', "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "direct_message" add constraint "direct_message_file_id_unique" unique ("file_id");',
    );

    this.addSql(
      'alter table "direct_message" add constraint "direct_message_sender_id_foreign" foreign key ("sender_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "direct_message" add constraint "direct_message_receiver_id_foreign" foreign key ("receiver_id") references "user" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "direct_message" add constraint "direct_message_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "direct_message";');
  }
}
