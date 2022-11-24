import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class AcceptMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
