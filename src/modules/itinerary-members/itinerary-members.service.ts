import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Itinerary } from '../../entities/itinerary.entity';
import { ItineraryMember } from '../../entities/itinerary-member.entity';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { UsersService } from '../users/users.service';
import { AcceptMemberDto } from './dto/accept-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { DemoteMemberDto } from './dto/demote-member.dto';
import { PromoteMemberDto } from './dto/promote-member.dto';
import { RefuseMemberDto } from './dto/refuse-member.dto';
import { itineraryRelations } from '../../../utils/constants';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationAlias } from '../../entities/notification.entity';
import { NotificationSubject } from '../../../utils/types';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ItineraryMembersService {
  constructor(
    @InjectRepository(ItineraryMember)
    private itineraryMemberRepository: EntityRepository<ItineraryMember>,
    @InjectRepository(Itinerary)
    private itineraryRepository: EntityRepository<Itinerary>,
    @Inject(ItinerariesService)
    private itinerariesService: ItinerariesService,
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
    @Inject(NotificationsGateway)
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async findOne(itineraryMemberId: string) {
    try {
      return this.itineraryMemberRepository.findOneOrFail(
        { id: itineraryMemberId },
        ['user.profile.file'],
      );
    } catch (error) {
      throw error;
    }
  }

  async create(
    authUserId: number,
    itineraryId: number,
    createMemberDto: CreateMemberDto,
  ) {
    try {
      const itinerary = await this.itinerariesService.show(itineraryId);

      if (itinerary.owner.id === authUserId) {
        throw new HttpException("You can't join to your itinerary.", 401);
      }

      const userDate = new Date(Date.parse(createMemberDto.currentDate));

      if (itinerary.deadlineForJoin.getTime() < userDate.getTime()) {
        throw new HttpException(
          "You can't join to this itinerary anymore.",
          401,
        );
      }

      const user = await this.usersService.findOne({ id: authUserId });
      const newMember = new ItineraryMember({
        itinerary: itinerary,
        user: user,
      });

      await this.itineraryMemberRepository.persistAndFlush(newMember);

      const selectedMember = await this.findOne(newMember.id);

      await this.notificationsService.create(itinerary.owner.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_REQUEST,
        subject: NotificationSubject.memberRequest,
        content: `em ${itinerary.name}`,
        jsonData: selectedMember,
      });

      return newMember;
    } catch (error) {
      throw error;
    }
  }

  async itineraries(authUserId: number) {
    try {
      return this.itineraryRepository.find(
        { members: { user: authUserId } },
        itineraryRelations,
      );
    } catch (error) {
      throw new HttpException("Can't find member itineraries", 400);
    }
  }

  async acceptMember(
    authUserId: number,
    itineraryId: number,
    acceptMemberDto: AcceptMemberDto,
  ) {
    try {
      const member = await this.itineraryMemberRepository.findOneOrFail(
        {
          user: acceptMemberDto.userId,
          itinerary: { id: itineraryId, owner: authUserId },
        },
        ['itinerary.owner'],
      );

      member.isAccepted = true;

      await this.itineraryMemberRepository.flush();

      const selectedMember = await this.findOne(member.id);

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_ACCEPTED,
        subject: NotificationSubject.memberAccept,
        content: `em ${member.itinerary.name}`,
        jsonData: selectedMember,
      });

      return member;
    } catch (error) {
      throw new HttpException('Error on accept member', 401);
    }
  }

  async refuseMember(
    authUserId: number,
    itineraryId: number,
    refuseMemberDto: RefuseMemberDto,
  ) {
    try {
      const member = await this.itineraryMemberRepository.findOneOrFail(
        {
          itinerary: { id: itineraryId, owner: authUserId },
          user: refuseMemberDto.userId,
        },
        ['itinerary.owner', 'user'],
      );

      member.deletedAt = new Date(Date.now());

      await this.itineraryMemberRepository.flush();

      const selectedMember = await this.findOne(member.id);

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_REJECTED,
        subject: NotificationSubject.memberReject,
        content: `em ${member.itinerary.name}`,
        jsonData: selectedMember,
      });

      return member;
    } catch (error) {
      throw new HttpException('Error on refuse member', 401);
    }
  }

  async promoteMember(
    authUserId: number,
    itineraryId: number,
    promoteMemberDto: PromoteMemberDto,
  ) {
    try {
      const member = await this.itineraryMemberRepository.findOneOrFail(
        {
          itinerary: { id: itineraryId, owner: authUserId },
          user: promoteMemberDto.userId,
        },
        ['itinerary.owner', 'user'],
      );

      member.isAdmin = true;

      await this.itineraryMemberRepository.flush();

      const selectedMember = await this.findOne(member.id);

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_PROMOTED,
        subject: NotificationSubject.memberPromoted,
        content: `em ${member.itinerary.name}`,
        jsonData: selectedMember,
      });

      return member;
    } catch (error) {
      throw new HttpException('Error on promote member', 401);
    }
  }

  async demoteMember(
    authUserId: number,
    itineraryId: number,
    demoteMemberDto: DemoteMemberDto,
  ) {
    try {
      const member = await this.itineraryMemberRepository.findOneOrFail(
        {
          user: demoteMemberDto.userId,
          itinerary: { id: itineraryId, owner: authUserId },
        },
        ['itinerary.owner', 'user'],
      );

      member.isAdmin = false;

      await this.itineraryMemberRepository.flush();

      const selectedMember = await this.findOne(member.id);

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_DEMOTED,
        subject: NotificationSubject.memberDemoted,
        content: `em ${member.itinerary.name}`,
        jsonData: selectedMember,
      });

      return member;
    } catch (error) {
      throw new HttpException('Error on demote member', 401);
    }
  }

  async leave(authUserId: number, itineraryId: number) {
    try {
      const itineraryMember =
        await this.itineraryMemberRepository.findOneOrFail({
          itinerary: itineraryId,
          user: authUserId,
        });

      return await this.itineraryMemberRepository.removeAndFlush(
        itineraryMember,
      );
    } catch (error) {
      throw new HttpException(
        'Error on leave itinerary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
