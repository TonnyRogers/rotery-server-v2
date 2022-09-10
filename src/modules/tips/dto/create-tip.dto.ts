import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { User } from '@/entities/user.entity';

class CardInfo {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty()
  @IsString()
  paymentMethod!: string;

  @ApiProperty()
  @IsString()
  issuerId!: string;
}
export class CreateTipDto {
  @ApiProperty()
  @IsNotEmpty()
  user!: User;

  @ApiProperty()
  @IsString()
  paymentAmount!: string;

  @ApiProperty()
  @IsNotEmpty()
  cardInfo!: CardInfo;
}
