import { Migration } from '@mikro-orm/migrations';

export class Migration20220817172520 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "itinerary_transport" add column "capacity" int not null;',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "price" type decimal(8,2) using ("price"::decimal(8,2));',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" type varchar(255) using ("description"::varchar(255));',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" set not null;',
    );

    this.addSql(
      'alter table "user_rating" add column "owner_id" int not null;',
    );
    this.addSql(
      'alter table "user_rating" drop constraint "user_rating_pkey";',
    );
    this.addSql(
      'alter table "user_rating" add constraint "user_rating_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql('alter table "user_rating" drop column "id";');
    this.addSql(
      'alter table "user_rating" add constraint "user_rating_pkey" primary key ("user_id", "owner_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_rating" drop constraint "user_rating_owner_id_foreign";',
    );

    this.addSql(
      'alter table "itinerary_transport" alter column "price" type varchar using ("price"::varchar);',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" type varchar using ("description"::varchar);',
    );
    this.addSql(
      'alter table "itinerary_transport" alter column "description" drop not null;',
    );
    this.addSql('alter table "itinerary_transport" drop column "capacity";');

    this.addSql(
      'alter table "user_rating" add column "id" int8 not null default null;',
    );
    this.addSql(
      'alter table "user_rating" drop constraint "user_rating_pkey";',
    );
    this.addSql('alter table "user_rating" drop column "owner_id";');
    this.addSql(
      'alter table "user_rating" add constraint "user_rating_pkey" primary key ("id");',
    );
  }
}
