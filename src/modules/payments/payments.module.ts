import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PaymentController } from './payments.controller';
import { PaymentService } from './payments.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [MikroOrmModule.forFeature([User]), UsersModule],
  exports: [PaymentService],
})
export class PaymentModule {}
