import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsEnum,
  IsMimeType,
  IsOptional,
  IsString,
} from 'class-validator';

import { ContentType } from '@/entities/content-list.entity';

export class CreateContentDto {
  @ApiProperty()
  @IsOptional()
  @IsMimeType()
  file?: any;

  @ApiProperty()
  @IsOptional()
  @IsString()
  externalUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  redirectLink?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  key?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty()
  @IsBoolean()
  isList: boolean;

  @ApiProperty()
  @IsBoolean()
  withInfo: boolean;

  @ApiProperty()
  @IsBoolean()
  isAnimation: boolean;
}
