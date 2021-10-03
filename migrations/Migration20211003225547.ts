import { Migration } from '@mikro-orm/migrations';

const baseTransports = [
  {
    name: 'Carro',
    alias: 'car',
  },
  {
    name: 'Ônibus',
    alias: 'bus',
  },
  {
    name: 'Moto',
    alias: 'motocycle',
  },
  {
    name: 'A pé',
    alias: 'on_foot',
  },
  {
    name: 'Transporte Público',
    alias: 'public_transportation',
  },
  {
    name: 'Bicicleta',
    alias: 'bike',
  },
  {
    name: 'Quadriciclo',
    alias: 'quadricycle',
  },
  {
    name: 'Van',
    alias: 'van',
  },
];

const dateNow = new Date(Date.now()).toISOString();

export class Migration20211003225547 extends Migration {
  async up(): Promise<void> {
    baseTransports.map(async (item) => {
      this.addSql(
        `insert into "transport" ("name", "alias","created_at", "updated_at") values ('${item.name}','${item.alias}','${dateNow}', '${dateNow}');`,
      );
    });
  }

  async down(): Promise<void> {
    this.addSql(`select 1;`);
  }
}
