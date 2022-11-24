import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ProfileService } from './profile.service';

import { Profile } from '../../entities/profile.entity';
import { ProfileController } from './profile.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Profile])],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
