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
import { FeedItinerariesModule } from './modules/feed-itineraries/feed-itineraries.module';
import { FavoriteItinerariesModule } from './modules/favorite-itineraries/favorite-itineraries.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UserRatingsModule } from './modules/user-ratings/user-ratings.module';
import { ItinerariesRatingsModule } from './modules/itinerary-ratings/itinerary-ratings.module';
import { EmailsModule } from './modules/emails/emails.module';
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { ChatSocketModule } from './modules/chat/chat.module';
import { PaymentModule } from './modules/payments/payments.module';

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
    FeedItinerariesModule,
    FavoriteItinerariesModule,
    NotificationsModule,
    UserRatingsModule,
    ItinerariesRatingsModule,
    EmailsModule,
    ResetPasswordsModule,
    ChatSocketModule,
    PaymentModule,
    // ClientsModule.register([
    // {
    //   name: 'send_email',
    //   transport: Transport.REDIS,
    //   options: {
    //     password: redisConfig.password,
    //     host: redisConfig.host,
    //   },
    // },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
