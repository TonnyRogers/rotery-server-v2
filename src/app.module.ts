import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import mikroormconfig from './mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profiles/profile.module';
import { FilesModule } from './modules/files/files.module';
import { DirectMessagesModule } from './modules/direct-messages/direct-messages.module';
import { UserConnectionModule } from './modules/user-connections/user-connections.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroormconfig),
    UsersModule,
    AuthModule,
    ProfileModule,
    FilesModule,
    DirectMessagesModule,
    UserConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
