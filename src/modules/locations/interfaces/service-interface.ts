import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { Location } from '@/entities/location.entity';
import { QueryPagination } from '@/utils/interfaces/query-pagination';

import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

export class GetLocationQueryFilter extends QueryPagination {
  @ApiProperty()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;
}

export interface LocationsServiceInterface {
  getAll(params: GetLocationQueryFilter): Promise<Location[] | never>;
  add(createLocationDto: CreateLocationDto): Promise<Location>;
  update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location>;
  remove(id: number): Promise<void>;
}
