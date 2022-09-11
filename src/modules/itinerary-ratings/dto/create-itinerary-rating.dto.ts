import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItineraryRatingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsString()
  description: string;
}
