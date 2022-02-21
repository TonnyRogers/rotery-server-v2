import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentDto {
  @ApiProperty()
  amount: number;
}
