import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class ChangeSubscriptionCardDto {
  @ApiProperty()
  @IsNotEmpty()
  card_token_id: string;
}
