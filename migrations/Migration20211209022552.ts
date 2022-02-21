import { Migration } from '@mikro-orm/migrations';

export class Migration20211209022552 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "subscription" ("id" serial primary key, "reference_id" varchar(255) not null, "plan_id" int4 null, "user_id" int4 not null, "status" text check ("status" in (\'authorized\', \'pending\', \'cancelled\', \'paused\')) not null default \'pending\', "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null);');

    this.addSql('alter table "subscription" add constraint "subscription_plan_id_foreign" foreign key ("plan_id") references "plan" ("id") on update cascade on delete set null;');
    this.addSql('alter table "subscription" add constraint "subscription_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table "subscription";');
  }
}
