import { ApiProperty } from '@nestjs/swagger';

import { IsLowercase, IsNotEmpty } from 'class-validator';

export class CreateTransportDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsLowercase()
  alias: string;
}
