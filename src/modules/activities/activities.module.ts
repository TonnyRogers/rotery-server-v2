import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Activity } from '../../entities/activity.entity';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [MikroOrmModule.forFeature([Activity])],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
