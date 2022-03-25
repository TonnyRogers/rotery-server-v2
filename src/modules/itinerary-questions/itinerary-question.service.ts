import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { NotificationAlias } from '../../entities/notification.entity';
import { NotificationSubject } from '@/utils/types';
import { ItineraryQuestion } from '../../entities/itinerary-question.entity';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsService } from '../notifications/notifications.service';
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
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
    @InjectRepository(ItineraryQuestion)
    private itineraryQuestionRepository: EntityRepository<ItineraryQuestion>,
    @Inject(NotificationsGateway)
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async findAll(itineraryId: number) {
    try {
      return this.itineraryQuestionRepository.find(
        { itinerary: { id: itineraryId, deletedAt: null } },
        { populate: ['owner.profile.file', 'itinerary'] },
      );
    } catch (error) {
      throw new HttpException("Can't find any question", 400);
    }
  }

  async findOne(itineraryQuestionId: string) {
    try {
      return this.itineraryQuestionRepository.findOneOrFail(
        { id: itineraryQuestionId },
        { populate: ['owner.profile.file'] },
      );
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
        itinerary: itinerary,
        owner: user,
        ...createItineraryQuestionDto,
      });

      await this.itineraryQuestionRepository.persistAndFlush(newQuestion);

      const selectedQuestion = await this.findOne(newQuestion.id);

      await this.notificationsService.create(itinerary.owner.id, {
        alias: NotificationAlias.ITINERARY_QUESTION,
        subject: NotificationSubject.itineraryQuestion,
        content: `em ${itinerary.name}`,
        jsonData: selectedQuestion,
      });

      return newQuestion;
    } catch (error) {
      throw new HttpException('Error on create this question.', 400);
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

      const itineraryQuestion = await this.findOne(
        String(replyItineraryQuestionDto.questionId),
      );

      itineraryQuestion.answer = replyItineraryQuestionDto.answer;

      await this.itineraryQuestionRepository.flush();

      await this.notificationsService.create(itineraryQuestion.owner.id, {
        alias: NotificationAlias.ITINERARY_ANSWER,
        subject: NotificationSubject.itineraryAnswer,
        content: `em ${itinerary.name}`,
        jsonData: itineraryQuestion,
      });

      return itineraryQuestion;
    } catch (error) {
      throw new HttpException("Can't create this question.", 400);
    }
  }
}
