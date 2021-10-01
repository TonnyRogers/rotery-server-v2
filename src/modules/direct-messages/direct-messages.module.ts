import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';
import { DirectMessage } from './entities/direct-message.entity';

@Module({
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService],
  imports: [MikroOrmModule.forFeature([DirectMessage, User]), UsersModule],
  exports: [DirectMessagesService],
})
export class DirectMessagesModule {}
