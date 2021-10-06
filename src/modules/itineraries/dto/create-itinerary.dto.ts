import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { ItineraryActivity } from 'src/entities/itinerary-activity.entity';
import { ItineraryLodging } from 'src/entities/itinerary-lodging.entity';
import { ItineraryPhoto } from 'src/entities/itinerary-photo.entity';
import { ItineraryTransport } from 'src/entities/itinerary-transport.entity';

export class CreateItineraryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  begin: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  end: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  deadlineForJoin: string;

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
