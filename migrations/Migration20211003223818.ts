import { Migration } from '@mikro-orm/migrations';

const baseActivities = [
  {
    name: 'Trilha',
    alias: 'trekking',
  },
  {
    name: 'Camping',
    alias: 'camping',
  },
  {
    name: 'Off Road',
    alias: 'offroad',
  },
  {
    name: 'Quadriciclo',
    alias: 'quadricycle',
  },
  {
    name: 'Mergulho',
    alias: 'diving',
  },
  {
    name: 'Caminhada',
    alias: 'walking',
  },
  {
    name: 'Escalada',
    alias: 'climbing',
  },
  {
    name: 'Rafting',
    alias: 'rafting',
  },
  {
    name: 'Surf',
    alias: 'surf',
  },
  {
    name: 'Stake',
    alias: 'skate',
  },
  {
    name: 'Pedalada',
    alias: 'pedaling',
  },
  {
    name: 'Tirolesa',
    alias: 'zipline',
  },
  {
    name: 'Passeio de Barco/Lancha',
    alias: 'boat_ride',
  },
  {
    name: 'Salto de Paraquedas',
    alias: 'parachute',
  },
  {
    name: 'Asa Delta',
    alias: 'hang_gliding',
  },
];

const dateNow = new Date(Date.now()).toISOString();

export class Migration20211003223818 extends Migration {
  async up(): Promise<void> {
    baseActivities.map(async (item) => {
      this.addSql(
        `insert into "activity" ("name", "alias","created_at", "updated_at") values ('${item.name}','${item.alias}','${dateNow}', '${dateNow}');`,
      );
    });
  }

  async down(): Promise<void> {
    this.addSql(`select 1;`);
  }
}
