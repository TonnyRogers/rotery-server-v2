import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { MessageType } from '../../../entities/direct-message.entity';

export class CreateDirectMessageDto {
  @ApiProperty()
  receiver: { id: number };

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  jsonData: Record<string | number, unknown>;

  @ApiProperty()
  type: MessageType;
}
