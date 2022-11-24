import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindRatingsQueryFilterDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  user?: number;
}
