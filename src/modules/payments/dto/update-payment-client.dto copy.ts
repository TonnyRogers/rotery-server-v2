import { PartialType } from '@nestjs/swagger';
import { CreatePaymentCustomerDto } from './create-payment-client.dto';

export class UpdatePaymentCustomerDto extends PartialType(
  CreatePaymentCustomerDto,
) {}
