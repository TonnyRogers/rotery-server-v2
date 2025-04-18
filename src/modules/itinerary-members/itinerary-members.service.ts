import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Response } from 'express';

import { EmailsService } from '../emails/emails.service';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';

import { dayjsPlugins } from '@/providers/dayjs-config';
import {
  itineraryRelations,
  paymentStatusColor,
  paymentStatusRole,
} from '@/utils/constants';
import {
  MemberWithPaymentResponse,
  NotificationSubject,
  PaymentDetailsReponse,
  PaymentRefundResponse,
} from '@/utils/types';

import {
  ItineraryMember,
  PaymentStatus,
} from '../../entities/itinerary-member.entity';
import { Itinerary, ItineraryStatus } from '../../entities/itinerary.entity';
import { NotificationAlias } from '../../entities/notification.entity';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { AcceptMemberDto } from './dto/accept-member.dto';
import { CreateMemberWithPaymentDto } from './dto/create-member-with-payment.dto copy';
import { CreateMemberDto } from './dto/create-member.dto';
import { DemoteMemberDto } from './dto/demote-member.dto';
import { PromoteMemberDto } from './dto/promote-member.dto';
import { RefuseMemberDto } from './dto/refuse-member.dto';

@Injectable()
export class ItineraryMembersService {
  constructor(
    @InjectRepository(ItineraryMember)
    private itineraryMemberRepository: EntityRepository<ItineraryMember>,
    @InjectRepository(Itinerary)
    private itineraryRepository: EntityRepository<Itinerary>,
    @Inject(forwardRef(() => ItinerariesService))
    private itinerariesService: ItinerariesService,
    @Inject(UsersProvider.USERS_SERVICE)
    private usersService: UsersService,
    @Inject(NotificationsService)
    private notificationsService: NotificationsService,
    @Inject(PaymentService)
    private paymentService: PaymentService,
    @Inject(EmailsService)
    private emailsService: EmailsService,
  ) {}

  async paymentRefund(itineraryMember: ItineraryMember) {
    if (itineraryMember.itinerary.requestPayment) {
      const payment = await this.paymentService.getPaymentDetails(
        Number(itineraryMember.paymentId),
      );

      if (payment && payment.status === 'in_process') {
        await this.paymentService.updatePayment(payment.id, {
          status: 'cancelled',
        });
        return;
      }

      if (itineraryMember.itinerary.status === ItineraryStatus.ACTIVE) {
        const paymentRefund = await this.paymentService.refundPayment(
          Number(itineraryMember.paymentId),
          undefined,
        );

        if (!paymentRefund.id) {
          throw new HttpException(
            'Error on refund payment.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  async findOne(itineraryMemberId: string) {
    try {
      return this.itineraryMemberRepository.findOneOrFail(
        {
          id: itineraryMemberId,
          itinerary: { deletedAt: null },
          deletedAt: null,
        },
        {
          populate: ['user.profile.file'],
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findByPaymentId(paymentId: string) {
    try {
      return await this.itineraryMemberRepository.findOne({
        paymentId,
      });
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
      if (!itinerary.requestPayment) {
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
        return { ...newMember, itinerary: newMember.itinerary.id };
      } else {
        throw new HttpException(
          'This itinerary requires payment.',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(
    itineraryMemberId: string,
    status: PaymentStatus,
    res: Response,
    payment?: PaymentDetailsReponse,
  ) {
    try {
      const member = await this.itineraryMemberRepository.findOne(
        {
          id: itineraryMemberId,
          deletedAt: null,
        },
        {
          populate: ['user', 'user.email', 'itinerary.owner'],
        },
      );

      member.paymentStatus = status;

      await this.itineraryMemberRepository.flush();

      if (status === PaymentStatus.PAID) {
        const selectedMember = member;
        await this.itineraryMemberRepository.populate(member, [
          'itinerary.owner',
        ]);

        await this.notificationsService.create(member.itinerary.owner.id, {
          alias: NotificationAlias.ITINERARY_MEMBER_REQUEST,
          subject: NotificationSubject.memberRequest,
          content: `em ${member.itinerary.name}`,
          jsonData: selectedMember,
        });
      }

      await this.emailsService.send({
        to: member.user.email,
        type: 'itinerary-payment-updates',
        content: {
          name: member.user.username,
          paymentStatus: paymentStatusRole[status],
          paymentStatusColor: paymentStatusColor[status],
          cardBrand: payment.payment_method_id,
          cardBrandImage: `https://rotery-filestore.nyc3.digitaloceanspaces.com/card-brands/${payment.payment_method_id}.png`,
          cardLastNumbers: payment.card.last_four_digits,
          data: {
            Nome: member.itinerary.name,
            Ida:
              dayjsPlugins(member.itinerary.begin)
                .subtract(3, 'hours')
                .format('DD [de] MMMM [de] YYYY [as] HH:mm') +
              '(Horário de Brasília)',
            Volta:
              dayjsPlugins(member.itinerary.end)
                .subtract(3, 'hours')
                .format('DD [de] MMMM [de] YYYY [as] HH:mm') +
              '(Horário de Brasília)',
            Local: member.itinerary.location,
            Host: member.itinerary.owner.username,
            Total:
              status === PaymentStatus.REFUNDED
                ? payment.transaction_amount_refunded
                : payment.transaction_amount,
          },
        },
      });

      return res.status(200).send();
    } catch (error) {
      throw error;
    }
  }

  async itineraries(authUserId: number) {
    try {
      const memberItineraries = await this.itineraryRepository.find({
        members: { user: authUserId, deletedAt: null },
        deletedAt: null,
      });

      await this.itineraryRepository.populate(
        memberItineraries,
        itineraryRelations,
        {
          where: { members: { deletedAt: null } },
        },
      );

      return memberItineraries;
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
          itinerary: { id: itineraryId, owner: authUserId, deletedAt: null },
          deletedAt: null,
        },
        { populate: ['itinerary.owner'] },
      );

      member.isAccepted = true;

      await this.itineraryMemberRepository.flush();

      const memberPayload = {
        memberId: member.id,
        userId: member.user.id,
        itineraryId: member.itinerary.id,
      };

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_ACCEPTED,
        subject: NotificationSubject.memberAccept,
        content: `em ${member.itinerary.name}`,
        jsonData: memberPayload,
      });

      return await this.findOne(member.id);
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
          itinerary: { id: itineraryId, owner: authUserId, deletedAt: null },
          user: refuseMemberDto.userId,
          deletedAt: null,
        },
        { populate: ['itinerary.owner', 'user', 'paymentId'] },
      );

      await this.paymentRefund(member);

      member.deletedAt = new Date(Date.now());

      const memberPayload = {
        memberId: member.id,
        userId: member.user.id,
        itineraryId: member.itinerary.id,
      };

      await this.itineraryMemberRepository.flush();

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_REJECTED,
        subject: NotificationSubject.memberReject,
        content: `em ${member.itinerary.name}`,
        jsonData: memberPayload,
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
          itinerary: { id: itineraryId, owner: authUserId, deletedAt: null },
          user: promoteMemberDto.userId,
          deletedAt: null,
        },
        { populate: ['itinerary.owner', 'user'] },
      );

      member.isAdmin = true;

      await this.itineraryMemberRepository.flush();

      const memberPayload = {
        memberId: member.id,
        userId: member.user.id,
        itineraryId: member.itinerary.id,
      };

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_PROMOTED,
        subject: NotificationSubject.memberPromoted,
        content: `em ${member.itinerary.name}`,
        jsonData: memberPayload,
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
          itinerary: { id: itineraryId, owner: authUserId, deletedAt: null },
          deletedAt: null,
        },
        { populate: ['itinerary.owner', 'user'] },
      );

      member.isAdmin = false;

      await this.itineraryMemberRepository.flush();

      const memberPayload = {
        memberId: member.id,
        userId: member.user.id,
        itineraryId: member.itinerary.id,
      };

      await this.notificationsService.create(member.user.id, {
        alias: NotificationAlias.ITINERARY_MEMBER_DEMOTED,
        subject: NotificationSubject.memberDemoted,
        content: `em ${member.itinerary.name}`,
        jsonData: memberPayload,
      });

      return member;
    } catch (error) {
      throw new HttpException('Error on demote member', 401);
    }
  }

  async leave(authUserId: number, itineraryId: number) {
    try {
      const itineraryMember =
        await this.itineraryMemberRepository.findOneOrFail(
          {
            itinerary: { id: itineraryId, deletedAt: null },
            deletedAt: null,
            user: authUserId,
          },
          { populate: ['paymentId', 'itinerary'] },
        );

      await this.paymentRefund(itineraryMember);

      itineraryMember.deletedAt = new Date(Date.now());
      return await this.itineraryMemberRepository.flush();
    } catch (error) {
      throw new HttpException(
        'Error on leave itinerary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createWithPayment(
    authUserId: number,
    itineraryId: number,
    createMemberWithPaymentDto: CreateMemberWithPaymentDto,
  ) {
    try {
      const itinerary = await this.itinerariesService.show(itineraryId);

      if (itinerary.owner.id === authUserId) {
        throw new HttpException("You can't join to your itinerary.", 401);
      }

      const userDate = new Date(
        Date.parse(createMemberWithPaymentDto.currentDate),
      );

      if (itinerary.deadlineForJoin.getTime() < userDate.getTime()) {
        throw new HttpException(
          "You can't join to this itinerary anymore.",
          401,
        );
      }

      const user = await this.usersService.findOneWithEmail({ id: authUserId });
      const paymentResponse = await this.paymentService.pay({
        ...createMemberWithPaymentDto.payment,
        metadata: {
          itineraryId: itinerary.id,
          itineraryName: itinerary.name,
          itineraryBegin: itinerary.begin,
        },
      });

      if (paymentResponse.status !== 'rejected') {
        const newMember = new ItineraryMember({
          itinerary: itinerary,
          user: user,
        });

        newMember.paymentStatus = PaymentStatus.PENDING;
        newMember.paymentId = String(paymentResponse.id);
        newMember.paymentAmount = String(
          createMemberWithPaymentDto.payment.transaction_amount,
        );

        await this.itineraryMemberRepository.persistAndFlush(newMember);

        const formatedNewMember = {
          ...newMember,
          itinerary: newMember.itinerary.id,
        };

        return {
          ...formatedNewMember,
          payment: { ...paymentResponse },
        };
      }

      return { payment: { ...paymentResponse } };
    } catch (error) {
      throw error;
    }
  }

  async listMemberWithPayment(
    authUserId: number,
  ): Promise<MemberWithPaymentResponse[]> {
    try {
      const memberList = await this.itineraryMemberRepository.find(
        {
          user: authUserId,
          $not: { paymentId: null },
        },
        { populate: ['paymentId', 'user'] },
      );

      const memberWithPayment: MemberWithPaymentResponse[] = [];

      const promisses = Promise.all(
        memberList.map(async (item) => {
          const payment = await this.paymentService.getPaymentDetails(
            Number(item.paymentId),
          );

          if (payment) {
            memberWithPayment.push({
              ...item,
              payment,
              itinerary: item.itinerary.id,
            });
          }
        }),
      );

      await promisses;

      return memberWithPayment;
    } catch (error) {
      throw error;
    }
  }

  async refundMember(
    authUserId: number,
    itineraryMemberId: string,
  ): Promise<PaymentRefundResponse> {
    try {
      const member = await this.itineraryMemberRepository.findOne(
        {
          id: itineraryMemberId,
        },
        { populate: ['paymentId', 'itinerary'] },
      );

      if (
        member.itinerary.status !== ItineraryStatus.ACTIVE ||
        member.user.id !== authUserId
      ) {
        throw new HttpException(
          "Can't refund this itinerary.",
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payment = await this.paymentService.getPaymentDetails(
        Number(member.paymentId),
      );

      if (payment && payment.status === 'in_process') {
        await this.paymentService.updatePayment(payment.id, {
          status: 'cancelled',
        });
        return;
      }

      // add itinerary status validation
      // add itinerary date validation
      if (member.paymentId) {
        return await this.paymentService.refundPayment(
          Number(member.paymentId),
          undefined,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllWithMemberPaymentId(authUserId: number) {
    try {
      const members = await this.itineraryMemberRepository.find(
        {
          itinerary: { owner: authUserId },
          $not: { paymentId: null },
        },
        {
          populate: [
            'paymentId',
            'user.profile.file',
            'itinerary.lodgings',
            'itinerary.activities',
            'itinerary.transports',
          ],
        },
      );

      let total = 0;

      const revenues = members.map((item) => {
        let amount = 0;
        item.itinerary.lodgings
          .getItems()
          .forEach((lodging) => (amount += Number(lodging.price)));
        item.itinerary.activities
          .getItems()
          .forEach((activity) => (amount += Number(activity.price)));
        item.itinerary.transports
          .getItems()
          .forEach((transport) => (amount += Number(transport.price)));

        total += item.paymentStatus === PaymentStatus.PAID ? amount : 0;

        return {
          id: item.id,
          member: {
            username: item.user.username,
            avatar: item.user.profile.file?.url,
          },
          itinerary: {
            id: item.itinerary.id,
            name: item.itinerary.name,
            begin: item.itinerary.begin,
          },
          paymentStatus: item.paymentStatus,
          amount,
          createdAt: item.createdAt,
        };
      });

      return {
        revenues,
        total,
      };
    } catch (error) {
      throw error;
    }
  }
}
