import { Migration } from '@mikro-orm/migrations';

export class Migration20220909151854 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tip" ("id" bigserial primary key, "payer_id" int not null, "user_id" int not null, "payment_id" varchar(255) null, "payment_status" text check ("payment_status" in (\'paid\', \'pending\', \'refunded\', \'refused\')) not null default \'pending\', "payment_amount" decimal(8,2) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "paid_at" timestamptz(0) null);',
    );

    this.addSql(
      'alter table "tip" add constraint "tip_payer_id_foreign" foreign key ("payer_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "tip" add constraint "tip_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tip" cascade;');
  }
}
