import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty } from 'class-validator';
import { ProcessPaymentDto } from 'src/modules/payments/dto/process-payment.dto';

export class CreateMemberWithPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  currentDate: string;

  @ApiProperty()
  @IsNotEmpty()
  payment: ProcessPaymentDto;
}
