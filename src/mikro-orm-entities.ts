import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { UserConnection } from './entities/user-connection.entity';
import { Activity } from './entities/activity.entity';
import { Lodging } from './entities/lodging.entity';
import { Transport } from './entities/transport.entity';
import { Itinerary } from './entities/itinerary.entity';
import { ItineraryActivity } from './entities/itinerary-activity.entity';
import { ItineraryLodging } from './entities/itinerary-lodging.entity';
import { ItineraryTransport } from './entities/itinerary-transport.entity';
import { ItineraryPhoto } from './entities/itinerary-photo.entity';
import { ItineraryQuestion } from './entities/itinerary-question.entity';
import { ItineraryMember } from './entities/itinerary-member.entity';
import { Notification } from './entities/notification.entity';
import { UserRating } from './entities/user-rating';
import { ItineraryRating } from './entities/itinerary-rating';
import { ResetPassword } from './entities/reset-password.entity';
import { BankAccount } from './entities/bank-account.entity';
import { Plan } from './entities/plan.entity';
import { Subscription } from './entities/subscription.entity';
import { Location } from './entities/location.entity';
import { LocationDetailing } from './entities/location-detailing.entity';

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
  ],
} as MikroOrmModuleOptions;
