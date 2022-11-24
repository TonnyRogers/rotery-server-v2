import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

export class UpdateConnectionDto {
  @ApiProperty()
  @IsBoolean()
  isBlocked: boolean;
}
