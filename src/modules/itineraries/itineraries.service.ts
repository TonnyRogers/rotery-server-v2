import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ItineraryTransport } from 'src/entities/itinerary-transport.entity';
import { Itinerary } from 'src/entities/itinerary.entity';
import { ItineraryActivity } from 'src/entities/itinerary-activity.entity';
import { ItineraryLodging } from 'src/entities/itinerary-lodging.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UsersService } from '../users/users.service';
import { ItineraryPhoto } from 'src/entities/itinerary-photo.entity';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';

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
      } = createItineraryDto;

      const newItinerary = new Itinerary({
        owner: 'id' in authUser && authUser,
        name,
        begin,
        end,
        deadlineForJoin,
        description,
        capacity,
        location,
        locationJson,
        isPrivate,
      });

      createItineraryDto.activities &&
        createItineraryDto.activities.forEach(async (activity) => {
          const newActivity = new ItineraryActivity({
            itinerary: newItinerary,
            ...activity,
          });
          this.itineraryActivityRepository.persist(newActivity);
        });

      createItineraryDto.transports &&
        createItineraryDto.transports.forEach(async (transport) => {
          const newTransport = new ItineraryTransport({
            itinerary: newItinerary,
            ...transport,
          });
          this.itineraryTransportRepository.persist(newTransport);
        });

      createItineraryDto.lodgings &&
        createItineraryDto.lodgings.forEach(async (lodging) => {
          const newLodging = new ItineraryLodging({
            itinerary: newItinerary,
            ...lodging,
          });
          this.itineraryLodgingRepository.persist(newLodging);
        });

      createItineraryDto.photos &&
        createItineraryDto.photos.forEach(async (photo) => {
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
      throw new HttpException('Error on create itinerary.', 400);
    }
  }

  async findAll(authUserId: number) {
    try {
      return await this.itineraryRepository.find({ owner: authUserId }, [
        'photos.file',
        'activities.activity',
        'lodgings.lodging',
        'transports.transport',
      ]);
    } catch (error) {
      throw new HttpException("Can't find your itineraries.", 400);
    }
  }

  async show(id: number) {
    try {
      return await this.itineraryRepository.find({ id }, [
        'photos.file',
        'activities.activity',
        'lodgings.lodging',
        'transports.transport',
      ]);
    } catch (error) {
      throw new HttpException("Can't find this itinerary.", 400);
    }
  }

  async update(
    authUserId: number,
    itineraryId: number,
    updateUserDto: UpdateItineraryDto,
  ) {
    try {
      const itinerary = await this.itineraryRepository.findOne({
        owner: authUserId,
        id: itineraryId,
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
      itinerary.begin = begin;
      itinerary.end = end;
      itinerary.deadlineForJoin = deadlineForJoin;
      itinerary.description = description;
      itinerary.capacity = capacity;
      itinerary.location = location;
      itinerary.locationJson = locationJson;
      itinerary.isPrivate = isPrivate;

      if (updateUserDto.activities) {
        await this.itineraryActivityRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.activities.forEach(async (activity) => {
          const newActivity = new ItineraryActivity({
            itinerary: itinerary.id,
            ...activity,
          });
          this.itineraryActivityRepository.persist(newActivity);
        });
      }

      if (updateUserDto.transports) {
        await this.itineraryTransportRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.transports.forEach(async (transport) => {
          const newTransport = new ItineraryTransport({
            itinerary: itinerary.id,
            ...transport,
          });
          this.itineraryTransportRepository.persist(newTransport);
        });
      }

      if (updateUserDto.lodgings) {
        await this.itineraryLodgingRepository.nativeDelete({
          itinerary: itinerary.id,
        });

        updateUserDto.lodgings.forEach(async (lodging) => {
          const newLodging = new ItineraryLodging({
            itinerary: itinerary.id,
            ...lodging,
          });
          this.itineraryLodgingRepository.persist(newLodging);
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
          this.itineraryPhotoRepository.persist(newPhoto);
        });
      }

      await this.itineraryRepository.flush();
      await this.itineraryActivityRepository.flush();
      await this.itineraryLodgingRepository.flush();
      await this.itineraryTransportRepository.flush();
      await this.itineraryPhotoRepository.flush();

      return this.show(itineraryId);
    } catch (error) {
      throw new HttpException("Can't update this itinerary.", 400);
    }
  }

  async delete(authUserId: number, itineraryId: number) {
    try {
      await this.itineraryRepository.findOneOrFail({
        owner: authUserId,
        id: itineraryId,
      });

      await this.itineraryRepository.nativeDelete({
        id: itineraryId,
        owner: authUserId,
      });
    } catch (error) {
      throw new HttpException('Error on delete your itinerary.', 400);
    }
  }
}
