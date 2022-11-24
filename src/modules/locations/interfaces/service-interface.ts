import { ApiProperty, OmitType } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { LocationDetailing } from '@/entities/location-detailing.entity';
import { Location } from '@/entities/location.entity';
import { QueryPagination } from '@/utils/interfaces/query-pagination';
import { PaginatedResponse } from '@/utils/types';

import { CreateLocationDto } from '../dto/create-location.dto';
import { GetLocationFeedQueryFilter } from '../dto/get-feed-query-filter.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

export class CustomLocationDetailing extends OmitType(LocationDetailing, [
  'location',
]) {
  icon: string;
  iconType: string;
  location: number;
}

export class FormatedLocationDetailingResponseDto extends OmitType(Location, [
  'detailings',
]) {
  detailings: CustomLocationDetailing[];
}

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
  getFeed(
    params: GetLocationFeedQueryFilter,
  ): Promise<PaginatedResponse<FormatedLocationDetailingResponseDto>>;
}
