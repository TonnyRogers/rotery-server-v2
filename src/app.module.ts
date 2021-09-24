import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import mikroormconfig from './mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profiles/profile.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroormconfig),
    UsersModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
