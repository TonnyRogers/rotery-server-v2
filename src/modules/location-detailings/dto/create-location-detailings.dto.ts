import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { LocationDetailingType } from '@/entities/location-detailing.entity';

export class CreateLocationDetailingsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LocationDetailingType)
  type!: LocationDetailingType;

  // EX: *$ local para refeição *$$
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;

  // EX: Replaced by *$ (Possui)
  @ApiProperty({
    description:
      'indicates de variations of some detailing to be replaced in text',
    example: '',
  })
  @IsString()
  variant?: string;

  // EX: Replaced by *$$ (4km)
  @ApiProperty()
  @IsString()
  variantText?: string;
}
