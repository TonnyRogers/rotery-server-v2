import { Migration } from '@mikro-orm/migrations';

export class Migration20210922005525 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "profile" add column "user_id" int4 not null;');
    this.addSql(
      'alter table "profile" add constraint "profile_user_id_unique" unique ("user_id");',
    );

    this.addSql(
      'alter table "profile" add constraint "profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "profile" drop constraint "profile_user_id_unique";',
    );

    this.addSql(
      'alter table "profile" drop constraint "profile_user_id_foreign";',
    );
    this.addSql('alter table "profile" drop column "user_id";');
  }
}
