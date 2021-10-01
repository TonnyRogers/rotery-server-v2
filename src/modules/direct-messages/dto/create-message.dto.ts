import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { MessageType } from '../entities/direct-message.entity';

export class CreateDirectMessageDto {
  @ApiProperty()
  receiver: User;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  jsonData: Record<string, unknown>;

  @ApiProperty()
  type: MessageType;
}
