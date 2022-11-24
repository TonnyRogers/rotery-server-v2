import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class CreatePaymentCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  phone: {
    area_code: string;
    number: string;
  };

  @ApiProperty()
  identification: {
    type: string;
    number: string;
  };

  @ApiProperty()
  default_address: string;

  @ApiProperty()
  address: {
    id: string;
    zip_code: string;
    street_name: string;
    street_number: string;
  };

  @ApiProperty()
  description: string;

  @ApiProperty()
  default_card: string;
}
