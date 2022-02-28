import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class QueryPagination {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;
}
