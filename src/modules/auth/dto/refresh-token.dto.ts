import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
