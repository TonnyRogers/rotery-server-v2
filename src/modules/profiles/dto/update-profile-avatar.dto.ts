import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { File } from '../../../entities/file.entity';

export class UpdateProfileFileDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  file: File;
}
