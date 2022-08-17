import { Entity, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';

import { userProfileFileSerializer } from '@/utils/serializers';

import { Location } from './location.entity';
import { User } from './user.entity';

@Entity()
export class GuideUserLocation {
  constructor({ location, user }: GuideUserLocation) {
    this.location = location;
    this.user = user;
  }

  @ManyToOne({
    entity: () => User,
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => userProfileFileSerializer(value),
  })
  user!: User;

  @ManyToOne({
    entity: () => Location,
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => value.id,
  })
  location!: Location;

  [PrimaryKeyType]?: [number, number];
}
