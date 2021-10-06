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
import { ActivitiesModule } from './modules/activities/activities.module';
import { LodgingsModule } from './modules/lodgings/lodgings.module';
import { TransportsModule } from './modules/transports/transports.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { ItineraryQuestionsModule } from './modules/itinerary-questions/itinerary-question.module';
import { ItineraryMembersModule } from './modules/itinerary-members/itinerary-members.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroormconfig),
    UsersModule,
    AuthModule,
    ProfileModule,
    FilesModule,
    DirectMessagesModule,
    UserConnectionModule,
    ActivitiesModule,
    LodgingsModule,
    TransportsModule,
    ItinerariesModule,
    ItineraryQuestionsModule,
    ItineraryMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
