import { ApiProperty } from '@nestjs/swagger';

type PaymentStatusType = 'cancelled';

export class UpdatePaymentDto {
  @ApiProperty()
  capture?: boolean;

  @ApiProperty()
  date_of_expiration?: string;

  @ApiProperty()
  metadata?: Record<string, unknown>;

  @ApiProperty()
  status?: PaymentStatusType;

  @ApiProperty()
  transaction_amount?: number;
}
