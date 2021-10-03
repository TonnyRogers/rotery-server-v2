import { Migration } from '@mikro-orm/migrations';

const baseLodgings = [
  {
    name: 'Camping',
    alias: 'camping',
  },
  {
    name: 'Pousada',
    alias: 'lodging',
  },
  {
    name: 'Hotel',
    alias: 'hotel',
  },
  {
    name: 'Hostel',
    alias: 'hostel',
  },
  {
    name: 'Casa',
    alias: 'house',
  },
  {
    name: 'Casa de Campo',
    alias: 'cottage',
  },
];

const dateNow = new Date(Date.now()).toISOString();

export class Migration20211003231624 extends Migration {
  async up(): Promise<void> {
    baseLodgings.map(async (item) => {
      this.addSql(
        `insert into "lodging" ("name", "alias","created_at", "updated_at") values ('${item.name}','${item.alias}','${dateNow}', '${dateNow}');`,
      );
    });
  }

  async down(): Promise<void> {
    this.addSql(`select 1;`);
  }
}
