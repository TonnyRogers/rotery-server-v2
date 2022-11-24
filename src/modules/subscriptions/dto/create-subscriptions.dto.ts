import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  preapproval_plan_id: string;

  @ApiProperty()
  @IsNotEmpty()
  card_token_id: string;

  @ApiProperty()
  @IsNotEmpty()
  payer_email: string;

  @ApiProperty()
  planId?: number;
}
