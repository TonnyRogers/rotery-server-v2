import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { ItineraryTransport } from '../../entities/itinerary-transport.entity';
import { Itinerary, ItineraryStatus } from '../../entities/itinerary.entity';
import { ItineraryActivity } from '../../entities/itinerary-activity.entity';
import { ItineraryLodging } from '../../entities/itinerary-lodging.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UsersService } from '../users/users.service';
import { ItineraryPhoto } from '../../entities/itinerary-photo.entity';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { itineraryRelations } from '../../../utils/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationPayload } from '../notifications/interfaces/create-notification';
import { NotificationAlias } from '../../entities/notification.entity';
import { NotificationSubject } from '../../../utils/types';
import { DirectMessagesService } from '../direct-messages/direct-messages.service';
import { CreateDirectMessageDto } from '../direct-messages/dto/create-message.dto';
import { MessageType } from '../../entities/direct-message.entity';
import { ItineraryMembersService } from '../itinerary-members/itinerary-members.service';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(Itinerary)
    private itineraryRepository: EntityRepository<Itinerary>,
    @InjectRepository(ItineraryActivity)
    private itineraryActivityRepository: EntityRepository<ItineraryActivity>,
    @InjectRepository(ItineraryLodging)
    private itineraryLodgingRepository: EntityRepository<ItineraryLodging>,
    @InjectRepository(ItineraryTransport)
    private itineraryTransportRepository: EntityRepository<ItineraryTransport>,
    @InjectRepository(ItineraryPhoto)
    private itineraryPhotoRepository: EntityRepository<ItineraryPhoto>,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(NotificationsService)
    private readonly notificationsService: NotificationsService,
    @Inject(DirectMessagesService)
    private readonly directMessagesService: DirectMessagesService,
    @Inject(forwardRef(() =>  ItineraryMembersService))
    private readonly itineraryMemberService: ItineraryMembersService,
  ) {}

  async create(authUserId: number, createItineraryDto: CreateItineraryDto) {
    try {
      const authUser = await this.usersService.findOne({ id: authUserId });

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
        requestPayment: true,
      });

      activities &&
        activities.forEach(async (activity) => {
          const newActivity = new ItineraryActivity({
            itinerary: newItinerary,
            ...activity,
          });
          this.itineraryActivityRepository.persist(newActivity);
        });

      transports &&
        transports.forEach(async (transport) => {
          const newTransport = new ItineraryTransport({
            itinerary: newItinerary,
            ...transport,
          });
          this.itineraryTransportRepository.persist(newTransport);
        });

      lodgings &&
        lodgings.forEach(async (lodging) => {
          const newLodging = new ItineraryLodging({
            itinerary: newItinerary,
            ...lodging,
          });
          this.itineraryLodgingRepository.persist(newLodging);
        });

      photos &&
        photos.forEach(async (photo) => {
          const newPhoto = new ItineraryPhoto({
            itinerary: newItinerary,
            ...photo,
          });
          this.itineraryPhotoRepository.persist(newPhoto);
        });

      await this.itineraryRepository.flush();
      await this.itineraryActivityRepository.flush();
      await this.itineraryLodgingRepository.flush();
      await this.itineraryTransportRepository.flush();
      await this.itineraryPhotoRepository.flush();

      return this.show(newItinerary.id);
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
        members: { deletedAt: null },
      });

      return itineraries;
    } catch (error) {
      throw error;
    }
  }

  async show(id: number) {
    try {
      const itineraries = await this.itineraryRepository.findOneOrFail({
        id,
        deletedAt: null,
      });

      await this.itineraryRepository.populate(itineraries, itineraryRelations, {
        members: { deletedAt: null },
      });

      return itineraries;
    } catch (error) {
      throw new HttpException('Error on find itinerary.', 404);
    }
  }

  async update(
    authUserId: number,
    itineraryId: number,
    updateUserDto: UpdateItineraryDto,
  ) {
    try {
      const itinerary = await this.itineraryRepository.findOneOrFail({
        owner: authUserId,
        id: itineraryId,
        deletedAt: null,
      });

      await this.itineraryRepository.populate(itinerary, itineraryRelations, {
        members: { deletedAt: null },
      });

      if (!itinerary) {
        return new HttpException('Cant find this itinerary.', 404);
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
      } = updateUserDto;

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

      const newActivityList = [];
      const newTransportList = [];
      const newLodgingList = [];
      const newPhotoList = [];

      if (updateUserDto.activities) {
        await this.itineraryActivityRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.activities.forEach((activity) => {
          const newActivity = new ItineraryActivity({
            itinerary: itinerary.id,
            ...activity,
          });
          newActivityList.push(newActivity);
        });
      }

      if (updateUserDto.transports) {
        await this.itineraryTransportRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.transports.forEach((transport) => {
          const newTransport = new ItineraryTransport({
            itinerary: itinerary.id,
            ...transport,
          });
          newTransportList.push(newTransport);
        });
      }

      if (updateUserDto.lodgings) {
        await this.itineraryLodgingRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.lodgings.forEach((lodging) => {
          const newLodging = new ItineraryLodging({
            itinerary: itinerary.id,
            ...lodging,
          });
          newLodgingList.push(newLodging);
        });
      }

      if (updateUserDto.photos) {
        await this.itineraryPhotoRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.photos.forEach(async (photo) => {
          const newPhoto = new ItineraryPhoto({
            itinerary: itinerary.id,
            ...photo,
          });
          newPhotoList.push(newPhoto);
        });
      }

      newActivityList.length > 0 &&
        (await this.itineraryActivityRepository.persistAndFlush(
          newActivityList,
        ));
      newLodgingList.length > 0 &&
        (await this.itineraryLodgingRepository.persistAndFlush(newLodgingList));
      newTransportList.length > 0 &&
        (await this.itineraryTransportRepository.persistAndFlush(
          newTransportList,
        ));
      newPhotoList.length > 0 &&
        (await this.itineraryPhotoRepository.persistAndFlush(newPhotoList));

      await this.itineraryRepository.flush();

      itinerary.members.getItems().forEach(async (member) => {
        if (member.isAccepted === true) {
          const notificationPayload: CreateNotificationPayload = {
            alias: NotificationAlias.ITINERARY_UPDATED,
            subject: NotificationSubject.itineraryUpdated,
            content: `${itinerary.name}`,
            jsonData: { ...itinerary },
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
      });

      return await this.show(itineraryId);
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
        members: { deletedAt: null },
      });

      itinerary.deletedAt = new Date(Date.now());

      await this.itineraryRepository.flush();

      itinerary.members.getItems().forEach(async (member) => {
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

          await this.itineraryMemberService.paymentRefund(member)

        }
      });

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

      await this.itineraryRepository.populate(itinerary, ['members'], {
        members: { deletedAt: null },
      });

      itinerary.status = ItineraryStatus.FINISHED;

      await this.itineraryRepository.flush();

      itinerary.members.getItems().forEach(async (member) => {
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
      });

      return;
    } catch (error) {
      throw error;
    }
  }
}
