import { Migration } from '@mikro-orm/migrations';

const baseActivities = [
  {
    name: 'Trilha',
    alias: 'trekking',
    icon: 'trekking-pole',
  },
  {
    name: 'Camping',
    alias: 'camping',
    icon: 'tent',
  },
  {
    name: 'Off Road',
    alias: 'offroad',
    icon: 'jeep',
  },
  {
    name: 'Quadriciclo',
    alias: 'quadricycle',
    icon: 'quad-bike',
  },
  {
    name: 'Mergulho',
    alias: 'diving',
    icon: 'scuba-diving',
  },
  {
    name: 'Caminhada',
    alias: 'walking',
    icon: 'hiking',
  },
  {
    name: 'Escalada',
    alias: 'climbing',
    icon: 'climbing',
  },
  {
    name: 'Rafting',
    alias: 'rafting',
    icon: 'raft',
  },
  {
    name: 'Surf',
    alias: 'surf',
    icon: 'surfboard',
  },
  {
    name: 'Stake',
    alias: 'skate',
    icon: 'skateboard',
  },
  {
    name: 'Pedalada',
    alias: 'pedaling',
    icon: 'bicycle',
  },
  {
    name: 'Tirolesa',
    alias: 'zipline',
    icon: 'zipline',
  },
  {
    name: 'Passeio de Barco/Lancha',
    alias: 'boat_ride',
    icon: 'boat',
  },
  {
    name: 'Salto de Paraquedas',
    alias: 'parachute',
    icon: 'skydiving',
  },
  {
    name: 'Asa Delta',
    alias: 'hang_gliding',
    icon: 'hang-gliding',
  },
  {
    name: 'Montanhismo',
    alias: 'mountaineering',
    icon: 'moutain-flag',
  },
  {
    name: 'Bungee Jump',
    alias: 'bungee_jump',
    icon: 'bumgee-jumping',
  },
  {
    name: 'Rappel',
    alias: 'rappel',
    icon: 'rappel',
  },
];

const dateNow = new Date(Date.now()).toISOString();

export class Migration20221026235040 extends Migration {
  async up(): Promise<void> {
    baseActivities.map(async (item) => {
      this.addSql(
        `insert into "activity" ("name", "alias","created_at", "updated_at","icon") values ('${item.name}','${item.alias}','${dateNow}', '${dateNow}','${item.icon}');`,
      );
    });
  }

  async down(): Promise<void> {
    this.addSql(`select 1;`);
  }
}
