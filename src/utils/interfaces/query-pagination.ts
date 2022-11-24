import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryPagination {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;
}
