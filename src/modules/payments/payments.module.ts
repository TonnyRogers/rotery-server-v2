import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PaymentService } from './payments.service';

import { User } from '../../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PaymentController } from './payments.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [MikroOrmModule.forFeature([User]), UsersModule],
  exports: [PaymentService],
})
export class PaymentModule {}
