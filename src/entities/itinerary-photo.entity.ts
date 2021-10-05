import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { File } from './file.entity';
import { Itinerary } from './itinerary.entity';

@Entity()
export class ItineraryPhoto {
  constructor({ itinerary, file }: ItineraryPhoto) {
    this.itinerary = itinerary;
    this.file = file;
  }

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Itinerary, { onDelete: 'cascade' })
  itinerary!: Itinerary;

  @ManyToOne(() => File, { onDelete: 'cascade' })
  file!: File;
}
