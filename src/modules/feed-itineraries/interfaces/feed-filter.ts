import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsString } from 'class-validator';

import { QueryPagination } from '@/utils/interfaces/query-pagination';

export class QueryFilter extends QueryPagination {
  @ApiProperty()
  @IsDateString()
  begin: string;

  @ApiProperty()
  @IsDateString()
  end: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;
}
