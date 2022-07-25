import { Entity, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';

import { File } from './file.entity';
import { Location } from './location.entity';

@Entity()
export class LocationPhoto {
  constructor({ location, file }: LocationPhoto) {
    this.location = location;
    this.file = file;
  }

  @ManyToOne(() => Location, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => value.id,
  })
  location!: Location;

  @ManyToOne(() => File, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value: File) => ({
      id: value.id,
      url: value.url,
    }),
  })
  file!: File;

  [PrimaryKeyType]?: [number, number];
}
