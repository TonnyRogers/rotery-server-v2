import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { LocationActivity } from '@/entities/location-activity.entity';
import { LocationLodging } from '@/entities/location-lodging.entity';
import { LocationPhoto } from '@/entities/location-photo.entity';
import { LocationTransport } from '@/entities/location-transport.entity';
import { LocationType } from '@/entities/location.entity';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  locationJson: Record<string, unknown>;

  @ApiProperty()
  @IsEnum(LocationType)
  type: LocationType;

  @ApiProperty()
  photos: LocationPhoto[];

  @ApiProperty()
  activities: LocationActivity[];

  @ApiProperty()
  lodgings: LocationLodging[];

  @ApiProperty()
  transports: LocationTransport[];
}
