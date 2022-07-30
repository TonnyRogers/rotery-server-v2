import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { LocationType } from '@/entities/location.entity';
import { QueryPagination } from '@/utils/interfaces/query-pagination';

enum RegionOptions {
  NORTE = 'Norte',
  NORDESTE = 'Nordeste',
  SUL = 'Sul',
  CENTRO_OESTE = 'Centro-Oeste',
  SULDESTE = 'Sudeste',
}

export class GetLocationFeedQueryFilter extends QueryPagination {
  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RegionOptions)
  region: RegionOptions;

  @ApiProperty()
  @IsOptional()
  @IsEnum(LocationType)
  type: LocationType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  activity: number;
}
