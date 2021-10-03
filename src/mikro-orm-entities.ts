import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { UserConnection } from './entities/user-connection.entity';
import { Activity } from './entities/activity.entity';
import { Lodging } from './entities/lodging.entity';
import { Transport } from './entities/transport.entity';

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
  ],
} as MikroOrmModuleOptions;
