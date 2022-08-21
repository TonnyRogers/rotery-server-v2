import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { File } from '../../../entities/file.entity';
import { Gender } from '../../../entities/profile.entity';

export class UpdateProfileDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  birth: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  document: string;

  @ApiProperty({ required: false })
  @IsOptional()
  profission: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  locationJson: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsOptional()
  file: File;
}
