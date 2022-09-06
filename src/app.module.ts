import { Module } from '@nestjs/common';

import mikroormconfig from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuthModule } from './modules/auth/auth.module';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { ChatSocketModule } from './modules/chat/chat.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { DirectMessagesModule } from './modules/direct-messages/direct-messages.module';
import { EmailsModule } from './modules/emails/emails.module';
import { FavoriteItinerariesModule } from './modules/favorite-itineraries/favorite-itineraries.module';
import { FeedItinerariesModule } from './modules/feed-itineraries/feed-itineraries.module';
import { FilesModule } from './modules/files/files.module';
import { FiltersModule } from './modules/filters/filters.module';
import { GuideUserLocationsModule } from './modules/guide-user-locations/guide-user-locations.module';
import { ItinerariesModule } from './modules/itineraries/itineraries.module';
import { ItineraryMembersModule } from './modules/itinerary-members/itinerary-members.module';
import { ItineraryQuestionsModule } from './modules/itinerary-questions/itinerary-question.module';
import { ItinerariesRatingsModule } from './modules/itinerary-ratings/itinerary-ratings.module';
import { LocationDetailingModule } from './modules/location-detailings/location-detailings.module';
import { LocationRatingsModule } from './modules/location-ratings/location-ratings.module';
import { LocationsModule } from './modules/locations/locations.module';
import { LodgingsModule } from './modules/lodgings/lodgings.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentModule } from './modules/payments/payments.module';
import { ProfileModule } from './modules/profiles/profile.module';
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { RevenuesModule } from './modules/revenues/revenues.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TipsModule } from './modules/tips/tips.module';
import { TransportsModule } from './modules/transports/transports.module';
import { UserConnectionModule } from './modules/user-connections/user-connections.module';
import { UserRatingsModule } from './modules/user-ratings/user-ratings.module';
import { UsersModule } from './modules/users/users.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

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
    WebhooksModule,
    RevenuesModule,
    CommunicationsModule,
    BankAccountsModule,
    SubscriptionsModule,
    LocationsModule,
    LocationDetailingModule,
    LocationRatingsModule,
    FiltersModule,
    GuideUserLocationsModule,
    MetadataModule,
    TipsModule,
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
