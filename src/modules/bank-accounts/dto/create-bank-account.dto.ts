import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  account: string;

  @ApiProperty()
  @IsNotEmpty()
  accountType: string;

  @ApiProperty()
  @IsNotEmpty()
  agency: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(31)
  @Min(1)
  payDay: number;
}
