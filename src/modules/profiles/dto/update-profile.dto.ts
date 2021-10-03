import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';
import { File } from '../../../entities/file.entity';
import { Gender } from '../../../entities/profile.entity';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  @IsDateString()
  birth: Date;

  @ApiProperty({ required: false })
  document: string;

  @ApiProperty({ required: false })
  profission: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false, enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ required: false })
  location: string;

  @ApiProperty({ required: false })
  locationJson: Record<string, unknown>;

  @ApiProperty({ required: false })
  file: File;
}
