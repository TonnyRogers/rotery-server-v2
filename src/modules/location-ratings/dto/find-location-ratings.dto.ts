import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FindLocationRatingsDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  ownerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  locationId: number;
}
