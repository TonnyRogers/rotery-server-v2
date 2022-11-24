import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

import { Activity } from './entities/activity.entity';
import { BankAccount } from './entities/bank-account.entity';
import { Chat } from './entities/chat.entity';
import { ContentList } from './entities/content-list.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { File } from './entities/file.entity';
import { GuideUserLocation } from './entities/guide-user-location.entity';
import { ItineraryActivity } from './entities/itinerary-activity.entity';
import { ItineraryLodging } from './entities/itinerary-lodging.entity';
import { ItineraryMember } from './entities/itinerary-member.entity';
import { ItineraryPhoto } from './entities/itinerary-photo.entity';
import { ItineraryQuestion } from './entities/itinerary-question.entity';
import { ItineraryRating } from './entities/itinerary-rating';
import { ItineraryTransport } from './entities/itinerary-transport.entity';
import { Itinerary } from './entities/itinerary.entity';
import { LocationActivity } from './entities/location-activity.entity';
import { LocationDetailing } from './entities/location-detailing.entity';
import { LocationLodging } from './entities/location-lodging.entity';
import { LocationPhoto } from './entities/location-photo.entity';
import { LocationRating } from './entities/location-rating';
import { LocationTransport } from './entities/location-transport.entity';
import { Location } from './entities/location.entity';
import { Lodging } from './entities/lodging.entity';
import { Notification } from './entities/notification.entity';
import { Plan } from './entities/plan.entity';
import { Profile } from './entities/profile.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { ResetPassword } from './entities/reset-password.entity';
import { Subscription } from './entities/subscription.entity';
import { Tip } from './entities/tip.entity';
import { Transport } from './entities/transport.entity';
import { UserConnection } from './entities/user-connection.entity';
import { UserRating } from './entities/user-rating';
import { User } from './entities/user.entity';

export default {
  entities: [
    User,
    File,
    Profile,
    DirectMessage,
    UserConnection,
    Activity,
    Transport,
    Lodging,
    Itinerary,
    ItineraryActivity,
    ItineraryLodging,
    ItineraryTransport,
    ItineraryPhoto,
    ItineraryQuestion,
    ItineraryMember,
    Notification,
    UserRating,
    ItineraryRating,
    ResetPassword,
    BankAccount,
    Plan,
    Subscription,
    Location,
    LocationDetailing,
    LocationActivity,
    LocationLodging,
    LocationPhoto,
    LocationTransport,
    Chat,
    LocationRating,
    GuideUserLocation,
    Tip,
    RefreshToken,
    ContentList,
  ],
} as MikroOrmModuleOptions;
