import { Migration } from '@mikro-orm/migrations';

export class Migration20220304192013 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "itinerary_member" add column "payment_amount" decimal(8,2) null;');
  }

  async dow(): Promise<void> {
    this.addSql('alter table "itinerary_member" drop column "payment_amount";');
  }

}
