import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  LocationDetailingLevel,
  LocationDetailingType,
} from '@/entities/location-detailing.entity';

export class CreateLocationDetailingsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  detailings: DetailingDto[];
}

export class DetailingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LocationDetailingType)
  type!: LocationDetailingType;

  @ApiProperty({ example: '1, 2' })
  quantity?: number;

  @ApiProperty({ example: 'km, hr, days' })
  measure?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(LocationDetailingLevel)
  level?: LocationDetailingLevel;

  @ApiProperty()
  validation?: boolean;

  // EX: *V* local para refeição (*Q**M*)
  // Existe local para refeitção (4km)
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;
}
