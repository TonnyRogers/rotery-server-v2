import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { File } from './modules/files/entities/file.entity';
import { Profile } from './modules/profiles/entities/profile.entity';
import { User } from './modules/users/entities/user.entity';
import { DirectMessage } from './modules/direct-messages/entities/direct-message.entity';
import { UserConnection } from './modules/user-connections/entities/user-connection.entity';

export default {
  entities: [User, File, Profile, DirectMessage, UserConnection],
  entitiesTs: [User, File, Profile, DirectMessage, UserConnection],
} as MikroOrmModuleOptions;
