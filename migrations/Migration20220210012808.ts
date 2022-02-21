import { Migration } from '@mikro-orm/migrations';

export class Migration20220210012808 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "subscription" add column "application_id" varchar(255) not null;');
    this.addSql('alter table "subscription" drop constraint if exists "subscription_status_check";');
    this.addSql('alter table "subscription" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "subscription" add constraint "subscription_status_check" check ("status" in (\'authorized\', \'pending\', \'cancelled\', \'paused\', \'no_payment\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "subscription" drop column "application_id";');
    this.addSql('alter table "subscription" drop constraint if exists "subscription_status_check";');
    this.addSql('alter table "subscription" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "subscription" add constraint "subscription_status_check" check ("status" in (\'authorized\', \'pending\', \'cancelled\', \'paused\'));');
  }

}
