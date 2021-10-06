import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  answer: string;

  @ApiProperty()
  @IsNotEmpty()
  questionId: number;
}
