import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Activity } from '../../entities/activity.entity';
import { ActivitiesController } from './activities.controller';
import { activitiesProvider } from './providers';

@Module({
  controllers: [ActivitiesController],
  imports: [MikroOrmModule.forFeature([Activity])],
  providers: activitiesProvider,
  exports: activitiesProvider,
})
export class ActivitiesModule {}
