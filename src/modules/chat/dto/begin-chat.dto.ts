import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class BeginChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  locationId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationCityState: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationName: string;
}
