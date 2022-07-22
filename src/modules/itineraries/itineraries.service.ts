import {
  forwardRef, 
  HttpException, 
  HttpStatus, 
  Inject, 
  Injectable, 
} from '@nestjs/common';

import { ItineraryTransport } from '@/entities/itinerary-transport.entity';
import { Itinerary, ItineraryStatus } from '@/entities/itinerary.entity';
import { ItineraryActivity } from '@/entities/itinerary-activity.entity';
import { ItineraryLodging } from '@/entities/itinerary-lodging.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UsersService } from '../users/users.service';
import { ItineraryPhoto } from '@/entities/itinerary-photo.entity';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { itineraryRelations } from '@/utils/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { NotificationAlias } from '@/entities/notification.entity';
import { NotificationSubject } from '@/utils/types';
import { DirectMessagesService } from '../direct-messages/direct-messages.service';
import { CreateDirectMessageDto } from '../direct-messages/dto/create-message.dto';
import { MessageType } from '@/entities/direct-message.entity';
import { ItineraryMembersService } from '../itinerary-members/itinerary-members.service';
import { ItineraryTransportRepository } from './repositories/itinerary-transport.repository';
import { ItineraryActivityRepository } from './repositories/itinerary-activity.repository';
import { ItineraryLodgingRepository } from './repositories/itinerary-lodging.repository';
import { ItineraryPhotoRepository } from './repositories/itinerary-photo.repository';
import { ItineraryRepository } from './repositories/itineraries.repository';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { EmailsService } from '../emails/emails.service';
import { dayjsPlugins } from '@/providers/dayjs-config';

@Injectable()
export class ItinerariesService {
  constructor(
    private readonly itineraryActivityRepository: ItineraryActivityRepository,
    private readonly itineraryLodgingRepository: ItineraryLodgingRepository,
    private readonly itineraryTransportRepository: ItineraryTransportRepository,
    private readonly itineraryPhotoRepository: ItineraryPhotoRepository,
    private itineraryRepository: ItineraryRepository,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    @Inject(DirectMessagesService)
    private readonly directMessagesService: DirectMessagesService,
    @Inject(SubscriptionsService)
    private readonly subscriptionsService: SubscriptionsService,
    @Inject(EmailsService)
    private readonly emailsService: EmailsService,
    @Inject(forwardRef(() =>  ItineraryMembersService))
    private readonly itineraryMemberService: ItineraryMembersService,
  ) {}

  async create(authUserId: number, createItineraryDto: CreateItineraryDto) {
    try {
      const authUser = await this.usersService.findOne({ id: authUserId });
      const userSubcription = await this.subscriptionsService.isValid(authUserId);      

      const {
        name,
        begin,
        end,
        deadlineForJoin,
        description,
        capacity,
        location,
        locationJson,
        isPrivate,
        activities,
        lodgings,
        photos,
        transports,
      } = createItineraryDto;

      const newItinerary = new Itinerary({
        owner: authUser,
        name,
        begin: new Date(Date.parse(begin)),
        end: new Date(Date.parse(end)),
        deadlineForJoin: new Date(Date.parse(deadlineForJoin)),
        description,
        capacity,
        location,
        locationJson,
        isPrivate,
        requestPayment: userSubcription?.allowed ? true : false,
      });

      activities?.length &&
        activities.forEach(async (activity) => {
          const newActivity = new ItineraryActivity({
            itinerary: newItinerary,
            ...activity,
          });
          this.itineraryActivityRepository.persist(newActivity);
        });

      transports?.length &&
        transports.forEach(async (transport) => {
          const newTransport = new ItineraryTransport({
            itinerary: newItinerary,
            ...transport,
          });
          this.itineraryTransportRepository.persist(newTransport);
        });

      lodgings?.length &&
        lodgings.forEach(async (lodging) => {
          const newLodging = new ItineraryLodging({
            itinerary: newItinerary,
            ...lodging,
          });
          this.itineraryLodgingRepository.persist(newLodging);
        });

      photos?.length &&
        photos.forEach(async (photo) => {
          const newPhoto = new ItineraryPhoto({
            itinerary: newItinerary,
            ...photo,
          });
          this.itineraryPhotoRepository.persist(newPhoto);
        });

      await this.itineraryRepository.persistAndFlush(newItinerary);
      await this.itineraryActivityRepository.flush();
      await this.itineraryLodgingRepository.flush();
      await this.itineraryTransportRepository.flush();
      await this.itineraryPhotoRepository.flush();

      return await this.show(newItinerary.id);
    } catch (error) {
      throw error;
    }
  }

  async findAll(authUserId: number) {
    try {
      const itineraries = await this.itineraryRepository.find({
        owner: authUserId,
        deletedAt: null,
      });

      await this.itineraryRepository.populate(itineraries, itineraryRelations, {
        where: { members: { deletedAt: null } },
      });

      return itineraries;
    } catch (error) {
      throw error;
    }
  }

  async show(id: number) {
    try {
      const itinerary = await this.itineraryRepository
        .findOneQB(
          { id, deletedAt: null },
          itineraryRelations, 
          { members: { deletedAt: null } 
        });

      return itinerary;
    } catch (error) {      
      throw new HttpException('Error on find itinerary.', 404);
    }
  }

  async update(
    authUserId: number,
    itineraryId: number,
    updateItineraryDto: UpdateItineraryDto,
  ) {
    try {
      const itinerary = await this.itineraryRepository.findOneOrFail({
        owner: authUserId,
        id: itineraryId,
        deletedAt: null,
      });

      await this.itineraryRepository.populate(itinerary, itineraryRelations, {
        where: { members: { deletedAt: null } },
      });

      if (!itinerary) {
        return new HttpException('Cant find this itinerary.', 404);
      }

      if (itinerary.members.length > updateItineraryDto.capacity) {
        throw new HttpException("Can't set capacity less than members list.", HttpStatus.UNAUTHORIZED);
      }

      const {
        name,
        begin,
        end,
        deadlineForJoin,
        description,
        capacity,
        location,
        locationJson,
        isPrivate,
      } = updateItineraryDto;

      const formatedTransports = updateItineraryDto.transports.map(item => ({ ...item, itinerary: itineraryId }));
      const formatedActivities = updateItineraryDto.activities.map(item => ({ ...item, itinerary: itineraryId }));
      const formatedLodgings = updateItineraryDto.lodgings.map(item => ({ ...item, itinerary: itineraryId }));
      const formatedPhotos = updateItineraryDto.photos.map(item => ({ ...item, itinerary: itineraryId }));

      // mudar para promise.all
      await this.itineraryTransportRepository.insertJoinTable({ itinerary: itineraryId },formatedTransports);
      await this.itineraryActivityRepository.insertJoinTable({ itinerary: itineraryId },formatedActivities);
      await this.itineraryLodgingRepository.insertJoinTable({ itinerary: itineraryId },formatedLodgings);
      await this.itineraryPhotoRepository.insertJoinTable({ itinerary: itineraryId },formatedPhotos);
      
      itinerary.name = name;
      itinerary.begin = new Date(Date.parse(begin));
      itinerary.end = new Date(Date.parse(end));
      itinerary.deadlineForJoin = new Date(Date.parse(deadlineForJoin));
      itinerary.description = description;
      itinerary.capacity = capacity;
      itinerary.location = location;
      if (locationJson) {
        itinerary.locationJson = locationJson;
      }
      itinerary.isPrivate = isPrivate;

      await this.itineraryRepository.flush();

      const updated = await this.show(itineraryId);

      for (const member of itinerary.members.getItems()) {
        if (member.isAccepted === true) {
          const notificationPayload: CreateNotificationPayload = {
            alias: NotificationAlias.ITINERARY_UPDATED,
            subject: NotificationSubject.itineraryUpdated,
            content: `${itinerary.name}`,
            jsonData: { ...updated },
          };
  
          await this.notificationsService.create(
            member.user.id,
            notificationPayload,
            true,
            true,
            true,
            { id: itinerary.id },
          );
        }        
      }
  
      
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async delete(authUserId: number, itineraryId: number) {
    try {
      const itinerary = await this.itineraryRepository.findOneOrFail({
        owner: { id: authUserId },
        id: itineraryId,
      });

      await this.itineraryRepository.populate(itinerary, ['members.user','members.paymentId'], {
        where: { members: { deletedAt: null } },
      });

      itinerary.deletedAt = new Date(Date.now());

      await this.itineraryRepository.flush();

      for (const member of itinerary.members.getItems()) {
        if (member.isAccepted === true) {
          const notificationPayload: CreateNotificationPayload = {
            alias: NotificationAlias.ITINERARY_DELETED,
            subject: NotificationSubject.itineraryDeleted,
            content: `${itinerary.name}`,
            jsonData: { id: itinerary.id },
          };
    
          await this.notificationsService.create(
            member.user.id,
            notificationPayload,
          );
            
          if(itinerary.status !== ItineraryStatus.CANCELLED) {
            await this.itineraryMemberService.paymentRefund(member);
          }
        }
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  async invite(authUserId: number, userId: number, itineraryId: number) {
    try {
      const { name, location, begin, id } =
        await this.itineraryRepository.findOneOrFail({
          id: itineraryId,
          deletedAt: null,
        });
      const user = await this.usersService.findOne({ id: authUserId });

      const itineraryPayload = {
        name,
        location,
        begin,
        id,
      };

      const newMessagPayload: CreateDirectMessageDto = {
        jsonData: { ...itineraryPayload },
        message: '',
        type: MessageType.ITINERARY_INVITE,
        receiver: { id: userId },
      };

      const newMessage = await this.directMessagesService.create(
        authUserId,
        userId,
        newMessagPayload,
      );

      const notificationPayload: CreateNotificationPayload = {
        alias: NotificationAlias.NEW_MESSAGE,
        subject: NotificationSubject.newMessage,
        content: `de ${user.username}`,
        jsonData: { ...newMessage },
      };

      await this.notificationsService.create(userId, notificationPayload);

      return;
    } catch (error) {
      throw error;
    }
  }

  async finish(authUserId: number, itineraryId: number) {
    try {
      const itinerary = await this.itineraryRepository.findOneOrFail({
        id: itineraryId,
        owner: authUserId,
        deletedAt: null,
      });

      await this.itineraryRepository.populate(itinerary, ['owner','members','members.user.email','members.paymentAmount'], {
        where: { members: { deletedAt: null, isAccepted: true } },
      });

      itinerary.status = ItineraryStatus.FINISHED;

      await this.itineraryRepository.flush();

      for (const member of itinerary.members.getItems()) {
        const notificationPayload: CreateNotificationPayload = {
          alias: NotificationAlias.ITINERARY_RATE,
          subject: NotificationSubject.itineraryRate,
          content: `${itinerary.name}`,
          jsonData: { id: itinerary.id },
        };
  
        await this.notificationsService.create(
          member.user.id,
          notificationPayload,
        );

        await this.emailsService.send({
          to: member.user.email,
          type: 'itinerary-finish',
          content: {
            name: member.user.username,
            itineraryDescription: member.itinerary.description,
            data: {
              Nome: member.itinerary.name,
              Ida: dayjsPlugins(member.itinerary.begin).subtract(3,'hours').format('DD [de] MMMM [de] YYYY [as] HH:mm') + ' (Horário de Brasília)',
              Volta: dayjsPlugins(member.itinerary.end).subtract(3,'hours').format('DD [de] MMMM [de] YYYY [as] HH:mm') + ' (Horário de Brasília)',
              Local: member.itinerary.location,
              Host: member.itinerary.owner.username,
              Total: member.paymentAmount,
            }
          }
        });
        
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  async createValidation(authUserId: number) {
    try {
      const countItineraries = await this.itineraryRepository
        .count({ 
          owner: authUserId,
          deletedAt: null, 
          status: { $nin: [ ItineraryStatus.FINISHED, ItineraryStatus.CANCELLED ] },
        });

      const userSubcription = await this.subscriptionsService.isValid(authUserId);

      if(userSubcription?.allowed) {
        return { 
          allowed: true, 
          count: countItineraries, 
          limit: 999999  
        };
      }


      return { 
        allowed: countItineraries >= 3 ? false : true, 
        count: countItineraries, 
        limit: 3  
      };
    } catch (error) {
      throw new HttpException('Error on validade creation try again.',HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 
}
