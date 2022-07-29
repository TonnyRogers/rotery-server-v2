import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class BeginChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationCityState: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationName: string;
}
