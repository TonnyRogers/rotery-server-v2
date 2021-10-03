import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserConnection } from '../../entities/user-connection.entity';
import { UserConnectionController } from './user-connections.controller';
import { UserConnectionService } from './user-connections.service';

@Module({
  controllers: [UserConnectionController],
  providers: [UserConnectionService],
  imports: [MikroOrmModule.forFeature([UserConnection]), UsersModule],
})
export class UserConnectionModule {}
