import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ItineraryMembersService } from './itinerary-members.service';

import { ParamId, RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AcceptMemberDto } from './dto/accept-member.dto';
import { CreateMemberWithPaymentDto } from './dto/create-member-with-payment.dto copy';
import { CreateMemberDto } from './dto/create-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItineraryMembersController {
  constructor(
    @Inject(ItineraryMembersService)
    private itinerarymembersService: ItineraryMembersService,
  ) {}

  @Post('/:id/join')
  async joinInItinerary(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.itinerarymembersService.create(
      request.user.userId,
      params.id,
      createMemberDto,
    );
  }

  @Post('/:id/join-with-payment')
  async joinItineraryWithPayment(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() createMemberWithPayment: CreateMemberWithPaymentDto,
  ) {
    return this.itinerarymembersService.createWithPayment(
      request.user.userId,
      params.id,
      createMemberWithPayment,
    );
  }

  @Get('/member')
  async getMemberItineraries(@Req() request: RequestUser) {
    return this.itinerarymembersService.itineraries(request.user.userId);
  }

  @Post('/:id/approve')
  async acceptMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.acceptMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/remove')
  async rejectMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.refuseMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/promote')
  async promoteMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.promoteMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/demote')
  async demoteMember(
    @Param() params: ParamId,
    @Req() request: RequestUser,
    @Body() acceptMemberDto: AcceptMemberDto,
  ) {
    return this.itinerarymembersService.demoteMember(
      request.user.userId,
      params.id,
      acceptMemberDto,
    );
  }

  @Post('/:id/leave')
  async leaveItinerary(@Param() params: ParamId, @Req() request: RequestUser) {
    return this.itinerarymembersService.leave(request.user.userId, params.id);
  }

  @Get('/member-with-payment')
  async listMemberWithPayment(@Req() request: RequestUser) {
    return this.itinerarymembersService.listMemberWithPayment(
      request.user.userId,
    );
  }

  @Post('/member/:id/refund')
  async refund(@Req() request: RequestUser, @Param() params: { id: string }) {
    return this.itinerarymembersService.refundMember(
      request.user.userId,
      params.id,
    );
  }
}
