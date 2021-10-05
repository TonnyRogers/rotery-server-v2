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

export default {
  entities: ['./dist/src/entities'],
  entitiesTs: [
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
  ],
} as MikroOrmModuleOptions;
