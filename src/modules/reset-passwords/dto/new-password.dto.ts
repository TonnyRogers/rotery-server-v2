import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, Length } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  passwordConfirmation: string;
}
