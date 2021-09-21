import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { File } from './modules/files/entities/file.entity';
import { Profile } from './modules/profiles/entities/profile.entity';
import { User } from './modules/users/entities/user.entity';

export default {
  entities: [User, File, Profile],
  entitiesTs: [User, File, Profile],
} as MikroOrmModuleOptions;
