import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { TipPaymentStatus } from '@/entities/tip.entity';
import { User } from '@/entities/user.entity';

export class CreateTipDto {
  @ApiProperty()
  @IsNotEmpty()
  user!: User;

  @ApiProperty()
  @IsString()
  paymentId!: string;

  @ApiProperty()
  @IsEnum(TipPaymentStatus)
  paymentStatus!: TipPaymentStatus;

  @ApiProperty()
  @IsString()
  paymentAmount!: string;
}
