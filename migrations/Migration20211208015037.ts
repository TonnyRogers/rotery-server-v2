import { Migration } from '@mikro-orm/migrations';

export class Migration20211208015037 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "plan" ("id" serial primary key, "reference_id" varchar(255) not null, "name" varchar(255) not null, "frequency_type" text check ("frequency_type" in (\'months\', \'days\')) not null default \'months\', "status" text check ("status" in (\'active\', \'inactive\', \'cancelled\')) not null default \'active\', "amount" decimal(8,2) not null, "repetitions" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null);');
  }
  
  async down(): Promise<void> {
    this.addSql('drop table "plan";');
  }
}
