import { ApiProperty } from '@nestjs/swagger';

import { IsLowercase, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsLowercase()
  alias: string;

  @ApiProperty()
  @IsOptional()
  @IsLowercase()
  icon?: string;
}
