import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ItineraryRating } from '../../entities/itinerary-rating';
import { CreateItineraryRatingDto } from './dto/create-itinerary-rating.dto';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { NotificationAlias } from '../../entities/notification.entity';
import { NotificationSubject } from '../../../utils/types';

@Injectable()
export class ItinerariesRatingsService {
  constructor(
    @InjectRepository(ItineraryRating)
    private ItinerariesRatingsRepository: EntityRepository<ItineraryRating>,
    @Inject(ItinerariesService)
    private itinerariessService: ItinerariesService,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
    @Inject(NotificationsGateway)
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    itineraryId: number,
    createItineraryRatingDto: CreateItineraryRatingDto,
  ) {
    try {
      const itinerary = await this.itinerariessService.show(itineraryId);
      const newRating = new ItineraryRating({
        itinerary: 'id' in itinerary && itinerary,
        ...createItineraryRatingDto,
      });
      await this.ItinerariesRatingsRepository.persistAndFlush(newRating);

      itinerary.members.getItems().forEach(async (member) => {
        const notificationPayload: CreateNotificationPayload = {
          alias: NotificationAlias.ITINERARY_RATE,
          subject: NotificationSubject.itineraryRate,
          content: `${itinerary.name}`,
          jsonData: { ...itinerary },
        };

        await this.notificationsService.create(
          member.user.id,
          notificationPayload,
        );
      });

      return newRating;
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }
}
