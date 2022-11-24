import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsEmail, Length, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, minLength: 6 })
  @IsNotEmpty()
  @Length(6)
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isGuide: boolean;
}
