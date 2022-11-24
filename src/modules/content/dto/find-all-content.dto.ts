import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ContentType } from '@/entities/content-list.entity';

export class FindAllContentDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  key: ContentType;
}
