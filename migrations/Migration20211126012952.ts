import { Migration } from '@mikro-orm/migrations';

export class Migration20211126012952 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "bank_account" ("id" serial primary key, "bank_code" varchar(255) not null, "bank_name" varchar(255) not null, "account" varchar(255) not null, "account_type" text check ("account_type" in (\'conta_corrente\', \'conta_poupanca\', \'conta_mei\')) not null default \'conta_corrente\', "agency" varchar(255) not null, "user_id" int4 not null, "pay_day" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "bank_account" add constraint "bank_account_user_id_unique" unique ("user_id");');

    this.addSql('alter table "bank_account" add constraint "bank_account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }
  async down(): Promise<void> {
        this.addSql('drop table "bank_account";');
  }
}
