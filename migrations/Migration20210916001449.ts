import { Migration } from '@mikro-orm/migrations';

export class Migration20210916001449 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "profile" ("id" serial primary key, "name" varchar(255) null, "birth" timestamptz(0) null, "document" varchar(255) null, "profission" varchar(255) null, "phone" varchar(255) null, "gender" text check ("gender" in (\'male\', \'female\', \'other\')) null, "location" varchar(255) null, "location_json" jsonb null, "file_id" int4 null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);',
    );
    this.addSql(
      'alter table "profile" add constraint "profile_document_unique" unique ("document");',
    );
    this.addSql(
      'alter table "profile" add constraint "profile_file_id_unique" unique ("file_id");',
    );

    this.addSql(
      'alter table "profile" add constraint "profile_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table "profile";');
  }
}
