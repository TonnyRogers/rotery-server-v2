import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { Activity } from 'src/entities/activity.entity';
import { File } from 'src/entities/file.entity';
import { ItineraryActivity } from 'src/entities/itinerary-activity.entity';
import { ItineraryLodging } from 'src/entities/itinerary-lodging.entity';
import { ItineraryPhoto } from 'src/entities/itinerary-photo.entity';
import { ItineraryTransport } from 'src/entities/itinerary-transport.entity';
import { Lodging } from 'src/entities/lodging.entity';
import { Transport } from 'src/entities/transport.entity';

export class CreateItineraryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  begin: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  end: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  deadlineForJoin: Date;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  locationJson: Record<string, unknown>;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  photos: ItineraryPhoto[];

  @ApiProperty()
  activities: ItineraryActivity[];

  @ApiProperty()
  lodgings: ItineraryLodging[];

  @ApiProperty()
  transports: ItineraryTransport[];
}
