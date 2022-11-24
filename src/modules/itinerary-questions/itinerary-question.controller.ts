import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ItineraryQuestionsService } from './itinerary-question.service';

import { ParamId, RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ReplyQuestionDto } from './dto/reply-question.dto';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItineraryQuestionsController {
  constructor(
    @Inject(ItineraryQuestionsService)
    private itineraryQuestionsService: ItineraryQuestionsService,
  ) {}

  @Post('/:id/questions')
  async makeQuestion(
    @Param() params: { id: number },
    @Req() request: RequestUser,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.itineraryQuestionsService.create(
      request.user.userId,
      params.id,
      createQuestionDto,
    );
  }

  @Get('/:id/questions')
  async getItineraryQuestions(@Param() params: ParamId) {
    return this.itineraryQuestionsService.findAll(params.id);
  }

  @Put('/:id/questions')
  async makeAnswer(
    @Req() request: RequestUser,
    @Param() params: { id: number },
    @Body() updateQuestionDto: ReplyQuestionDto,
  ) {
    return this.itineraryQuestionsService.reply(
      request.user.userId,
      params.id,
      updateQuestionDto,
    );
  }
}
