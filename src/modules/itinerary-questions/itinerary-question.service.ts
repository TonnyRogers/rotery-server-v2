import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ItineraryQuestion } from '../../entities/itinerary-question.entity';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { UsersService } from '../users/users.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ReplyQuestionDto } from './dto/reply-question.dto';

@Injectable()
export class ItineraryQuestionsService {
  constructor(
    @Inject(ItinerariesService)
    private itinerariesService: ItinerariesService,
    @Inject(UsersService)
    private usersService: UsersService,
    @InjectRepository(ItineraryQuestion)
    private itineraryQuestionRepository: EntityRepository<ItineraryQuestion>,
  ) {}

  async findAll(itineraryId: number) {
    try {
      return this.itineraryQuestionRepository.find({ itinerary: itineraryId }, [
        'owner.profile.file',
      ]);
    } catch (error) {
      throw new HttpException("Can't find any question", 400);
    }
  }

  async create(
    authUserId: number,
    itineraryId: number,
    createItineraryQuestionDto: CreateQuestionDto,
  ) {
    try {
      const itinerary = await this.itinerariesService.show(itineraryId);
      const user = await this.usersService.findOne({ id: authUserId });

      const newQuestion = new ItineraryQuestion({
        itinerary: 'id' in itinerary && itinerary,
        owner: 'id' in user && user,
        ...createItineraryQuestionDto,
      });

      await this.itineraryQuestionRepository.persistAndFlush(newQuestion);

      return newQuestion;
    } catch (error) {
      console.log(error);

      throw new HttpException("Can't create this question.", 400);
    }
  }

  async reply(
    authUserId: number,
    itineraryId: number,
    replyItineraryQuestionDto: ReplyQuestionDto,
  ) {
    try {
      const itinerary = await this.itinerariesService.show(itineraryId);

      if (!itinerary && itinerary.owner.id !== authUserId) {
        return new HttpException("Can't answer this question.", 403);
      }

      const itineraryQuestion = await this.itineraryQuestionRepository.findOne({
        id: String(replyItineraryQuestionDto.questionId),
      });

      itineraryQuestion.answer = replyItineraryQuestionDto.answer;

      await this.itineraryQuestionRepository.flush();

      return itineraryQuestion;
    } catch (error) {
      console.log(error);

      throw new HttpException("Can't create this question.", 400);
    }
  }
}
