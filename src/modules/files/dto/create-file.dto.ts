import { ApiProperty } from '@nestjs/swagger';

import { IsMimeType } from 'class-validator';

export class CreateFileDto {
  @ApiProperty()
  @IsMimeType()
  file: any;
}
