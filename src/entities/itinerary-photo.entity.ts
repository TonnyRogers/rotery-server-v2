import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKeyType,
} from '@mikro-orm/core';

import { ItineraryPhotoRepository } from '@/modules/itineraries/repositories/itinerary-photo.repository';

import { File } from './file.entity';
import { Itinerary } from './itinerary.entity';

@Entity({ customRepository: () => ItineraryPhotoRepository })
export class ItineraryPhoto {
  constructor({ itinerary, file }: ItineraryPhoto) {
    this.itinerary = itinerary;
    this.file = file;
  }

  @ManyToOne(() => Itinerary, {
    onDelete: 'cascade',
    primary: true,
    serializer: (value) => value.id,
  })
  itinerary!: Itinerary;

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
  [EntityRepositoryType]?: ItineraryPhotoRepository;
}
