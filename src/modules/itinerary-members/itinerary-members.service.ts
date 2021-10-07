import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Itinerary } from '../../entities/itinerary.entity';
import { ItineraryMember } from '../../entities/itinerary-member.entity';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { UsersService } from '../users/users.service';
import { AcceptMemberDto } from './dto/accept-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { DemoteMemberDto } from './dto/demote-member.dto';
import { PromoteMemberDto } from './dto/promote-member.dto';
import { RefuseMemberDto } from './dto/refuse-member.dto';
import { itineraryRelations } from 'utils/constants';

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
  ) {}

  async create(
    authUserId: number,
    itineraryId: number,
    createMemberDto: CreateMemberDto,
  ) {
    try {
      const itinerary = await this.itinerariesService.show(itineraryId);

      if (itinerary.owner.id === authUserId) {
        return new HttpException("You can't join to your itinerary.", 401);
      }

      const userDate = new Date(Date.parse(createMemberDto.currentDate));

      console.log('diff', {
        limit: itinerary.deadlineForJoin.getTime(),
        date: userDate.getTime(),
        iso: userDate.toISOString(),
      });

      if (itinerary.deadlineForJoin.getTime() < userDate.getTime()) {
        return new HttpException(
          "You can't join to this itinerary anymore.",
          401,
        );
      }

      const user = await this.usersService.findOne({ id: authUserId });
      const newMember = new ItineraryMember({
        itinerary: 'id' in itinerary && itinerary,
        user: 'id' in user && user,
      });

      await this.itineraryMemberRepository.persistAndFlush(newMember);

      return newMember;
    } catch (error) {
      throw new HttpException('Error on join in itinerary', 400);
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
      const member = await this.itineraryMemberRepository.findOne(
        {
          user: acceptMemberDto.userId,
          itinerary: { id: itineraryId, owner: authUserId },
        },
        ['itinerary.owner'],
      );

      member.isAccepted = true;

      await this.itineraryMemberRepository.flush();

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
      const member = await this.itineraryMemberRepository.findOne(
        {
          itinerary: { id: itineraryId, owner: authUserId },
          user: refuseMemberDto.userId,
        },
        ['itinerary.owner', 'user'],
      );

      member.deletedAt = new Date(Date.now());

      await this.itineraryMemberRepository.flush();

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
      const member = await this.itineraryMemberRepository.findOne(
        {
          itinerary: { id: itineraryId, owner: authUserId },
          user: promoteMemberDto.userId,
        },
        ['itinerary.owner', 'user'],
      );

      member.isAdmin = true;

      await this.itineraryMemberRepository.flush();

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
      const member = await this.itineraryMemberRepository.findOne(
        {
          user: demoteMemberDto.userId,
          itinerary: { id: itineraryId, owner: authUserId },
        },
        ['itinerary.owner', 'user'],
      );

      member.isAdmin = false;

      await this.itineraryMemberRepository.flush();

      return member;
    } catch (error) {
      throw new HttpException('Error on demote member', 401);
    }
  }
}
