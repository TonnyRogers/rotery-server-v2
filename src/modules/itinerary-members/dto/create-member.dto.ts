import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  currentDate: string;
}
