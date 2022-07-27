import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { ChatType } from '@/entities/chat.entity';

export class CreateChatDto {
  @ApiProperty()
  receiver: { id: number };

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  jsonData: Record<string | number, unknown>;

  @ApiProperty()
  type: ChatType;
}
